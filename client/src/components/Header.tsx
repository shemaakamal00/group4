function Header({ isLoggedIn }) {
  return (
    <header className="header">
      <h1>KarriärKoll</h1>
      <Login isLoggedIn={isLoggedIn} />
    </header>
  );
}

function Login({ isLoggedIn }) {
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