type HeaderProps = {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onGetStartedClick: () => void;
  onLogoutClick: () => void;
};

function Header({ isLoggedIn, onLoginClick, onGetStartedClick, onLogoutClick }: HeaderProps) {
  return (
    <header className="header">
      <h1>KarriärKoll</h1>
      <Login
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onGetStartedClick={onGetStartedClick}
        onLogoutClick={onLogoutClick}
      />
    </header>
  );
}

type LoginProps = {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onGetStartedClick: () => void;
  onLogoutClick: () => void;
};

function Login({ isLoggedIn, onLoginClick, onGetStartedClick, onLogoutClick }: LoginProps) {
  if (isLoggedIn) {
    return (
      <div className="login">
        <button type="button" onClick={onLogoutClick}>Logga ut</button>
      </div>
    );
  } else {
    return (
      <div className="login">
        <button type="button" onClick={onLoginClick}>Logga in</button>
        <button type="button" onClick={onGetStartedClick}>Kom igång</button>
      </div>
    );
  }
}

export default Header;