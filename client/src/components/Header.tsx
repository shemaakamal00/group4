type HeaderProps = {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onGetStartedClick: () => void;
  onLogoutClick: () => void;
};

function Header({ isLoggedIn, onLoginClick, onGetStartedClick, onLogoutClick }: HeaderProps) {
  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand__logo">K</span>
        <span className="brand__name">KarriärKoll</span>
      </div>
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
      <div className="nav-links">
        <button type="button" className="btn btn--secondary" onClick={onLogoutClick}>
          Logga ut
        </button>
      </div>
    );
  } else {
    return (
      <div className="nav-links">
        <button type="button" className="nav-link" onClick={onLoginClick}>
          Logga in
        </button>
        <button
          type="button"
          className="btn btn--primary btn--pill"
          onClick={onGetStartedClick}
        >
          Kom igång
        </button>
      </div>
    );
  }
}

export default Header;