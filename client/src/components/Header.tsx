type HeaderProps = {
  isLoggedIn: boolean;
};

function Header({ isLoggedIn }: HeaderProps) {
  return (
    <header className="header">
      <h1>KarriärKoll</h1>
      <Login isLoggedIn={isLoggedIn} />
    </header>
  );
}

type LoginProps = {
  isLoggedIn: boolean;
};

function Login({ isLoggedIn }: LoginProps) {
  if (isLoggedIn) {
    return (
      <div className="login">
        <a href="/logout">Logga ut</a>
      </div>
    );
  } else {
    return (
      <div className="login">
        <a href="/login">Logga in</a>
      </div>
    );
  }
}

export default Header;