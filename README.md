# KarriärKoll

KarriärKoll är ett webbaserat verktyg för att hålla koll på jobbansökningar, sätta mål och följa sin utveckling. Tjänsten har tre prenumerationsnivåer som ger tillgång till olika funktioner och innehåll.

Projektet är utvecklat som ett grupparbete i kursen Systemutveckling på Fullstackutvecklarprogrammet vid Medieinstitutet.

## Live

- **Frontend:** [(https://group4-pi.vercel.app/)]
- **Backend:** [(https://group4-sdf0.onrender.com/)]

## Teknikstack

| Del | Teknik |
|---|---|
| Frontend | Vite, React 19, TypeScript, CSS |
| Backend | Node.js, Express, TypeScript |
| Databas | Supabase (PostgreSQL) |
| Autentisering | Supabase Auth |
| Deploy | Vercel + Render |
| Diagram | Recharts |
| Drag & drop | @dnd-kit/core |
| PDF-generering | pdfkit |
| API-testning | Postman |

## Team och arbetsfördelning

### Shemaa Kamal — Career tracker, statistik & infrastruktur
- Databasschema och SQL migrationer
- Ansökningshantering med CRUD, kanban, drag & drop och sökning
- Dashboard med nivåbaserad statistik, diagram och insikter
- Målhantering med delmål och progress
- CSV och PDF export med nivåbaserad åtkomst
- Auth, route protection och server-side behörighetskontroller
- API integration mellan frontend och backend
- Setup och deploy via Supabase, Vercel och Render
- Postman-testning av API

### Nikolaos Kiosses — Konto & betalningar
- Landningssida och navigation
- Login, registrering och logout
- Uppgraderingsflöde och nivåval
- Profilhantering
- Pris och informationsmodaler
- Backend för betalningar och profil

### Harald Wallin — Innehåll & admin
- Delade modal komponenter
- Artikelsida och artikelvisning
- Nivåbaserad åtkomst till artiklar
- Adminfunktioner för att skapa, redigera och radera artiklar
- Backend för articles CRUD och adminbehörighet

## Prenumerationsnivåer

| Funktion | Grundpaket | Plus (79 kr/mån) | Premium (149 kr/mån) |
|---|---|---|---|
| Ansökningar | max 10 | max 50 | obegränsat |
| Mål | — | max 2 | obegränsat |
| Dashboard | räknare | + diagram | + insikter |
| Export | — | CSV | CSV + PDF |
| Artiklar | grund | grund + plus | alla |

## Funktioner

- Autentisering med Supabase Auth
- Tre prenumerationsnivåer med olika åtkomst
- Kanban vy för jobbansökningar med drag & drop och sökning
- Dashboard med statistik, diagram och insikter
- Mål och delmål med progress
- Nivåbaserat artikelinnehåll
- Export av ansökningar till CSV och PDF
- Uppgraderingsflöde när användaren når en gräns eller öppnar en låst funktion

## Lokal setup

Klona repot:

```bash
git clone https://github.com/shemaakamal00/group4.git
cd group4
```

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Servern startar på `http://localhost:3000`.

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend startar på `http://localhost:5173`.

### Databas

Kör SQL filen i Supabase SQL Editor:

1. `db/schema.sql`

## API

API:et innehåller endpoints för:

- `/api/applications` — ansökningar, statistik, användning och export
- `/api/goals` — mål, delmål och användningsgränser
- `/api/articles` — artiklar och adminhantering
- `/api/payments` — nivåuppgradering
- `/api/profile` — profil och nivåinformation

Endpoints under `/api/*` kräver autentisering med Bearer token om inget annat anges.

## Testning

Backend har testats manuellt med Postman och frontend har testats manuellt i webbläsaren för samtliga prenumerationsnivåer.

## Projektstruktur

```text
group4/
├── client/          # React-frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── lib/
│       ├── pages/
│       ├── styles/
│       └── types/
├── server/          # Express-backend
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── types/
├── docs/            # Databas, diagram och mockups
└── postman/         # API-testning
```

## Licens

Skolprojekt inte avsett för produktion.