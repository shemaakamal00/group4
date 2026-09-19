-- 1. SUBSCRIPTION_LEVEL --
create table public.subscription_level(
    id smallint primary key,
    level_name varchar (255) not null,
    access_level int not null,
    application_limit int,
    price numeric (10,2) not null default 0,
    description text
);
alter table public.subscription_level enable row level security;

insert into public.subscription_level (id, level_name, access_level, application_limit, price, description) values
(1, 'Grundpaket', 1, 10, 0, 'Basinnehåll, upp till 10 ansökningar, enkel statistik'),
(2, 'Plus', 2, 50, 79, 'Mer innehåll, upp till 50 ansökningar, diagram + export'),
(3, 'Premium', 3, null, 149, 'Allt innehåll, obegränsat, insikter, mål + påminnelser');

-- 2. PROFILE --
create table public.profile (
    id uuid primary key references auth.users(id) on delete cascade,
    first_name varchar(255),
    last_name varchar (255),
    role varchar (255) not null default 'user' check (role in ('user', 'admin')),
    level_id smallint not null default 1 references public.subscription_level(id),
    member_since timestamptz not null default now (),
    created_at timestamptz not null default now ()
);
alter table public.profile enable row level security;

-- 3. AUTH TRIGGER --
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profile(id, first_name, last_name)
    values (
        new.id, 
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name'
    );
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- 4. ARTICLE --
create table public.article (
    id uuid primary key default gen_random_uuid(),
    article_title varchar(255) not null,
    article_description text,
    article_text text not null,
    required_subscription_level_id smallint not null default 1 references public.subscription_level(id),
    created_by uuid references public.profile(id),
    created_at timestamptz not null default now (),
    updated_at timestamptz not null default now ()
);
alter table public.article enable row level security;
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ 
begin
    new.updated_at = now ();
    return new;
end;
$$;

create trigger article_updated_at
    before update on public.article
    for each row execute function public.set_updated_at();

-- 5. APPLICATION_STATUS --
create table public.application_status (
    id smallint primary key,
    status_name varchar(255) not null,
    status_color varchar(30) not null
);
alter table public.application_status enable row level security;

insert into public.application_status (id, status_name, status_color) values
    (1, 'Ansökt',     '#185FA5'),
    (2, 'Intervju',   '#854F0B'),
    (3, 'Erbjudande', '#3B6D11'),
    (4, 'Nej tack',   '#A32D2D');

-- 6. APPLICATION --
create table public.application (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profile (id) on delete cascade,
    title varchar(255) not null,
    company varchar(255),
    link varchar (255),
    notes text,
    application_status_id smallint not null default 1 references public.application_status(id),
    status_date date,
    applied_at date,
    response_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table public.application enable row level security;

create trigger application_updated_at
    before update on public.application
    for each row execute function public.set_updated_at();

-- 7. GOAL + GOAL_CRITERIA --
create table public.goal (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profile(id) on delete cascade,
    goal_name varchar(255) not null,
    goal_description text,
    created_at timestamptz not null default now()
);
alter table public.goal enable row level security;

create table public.goal_criteria (
    id uuid primary key default gen_random_uuid(),
    goal_id uuid not null references public.goal(id) on delete cascade,
    criteria_name varchar(255) not null,
    is_done boolean not null default false,
    created_at timestamptz not null default now()
);
alter table public.goal_criteria enable row level security;

-- 8. PAYMENT --
create table public.payment (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profile(id) on delete cascade,
    subscription_level_id smallint not null references public.subscription_level(id),
    total numeric(10,2) not null,
    status varchar(255) not null default 'Genomförd' check 
        (status in ('Genomförd', 'Misslyckad', 'Väntar')),
    paid_at timestamptz not null default now()
);
alter table public.payment enable row level security;

-- 9. INDEX --
create index on public.application (user_id);
create index on public.application (application_status_id);
create index on public.goal (user_id);
create index on public.goal_criteria (goal_id);
create index on public.payment (user_id);
create index on public.article (required_subscription_level_id);