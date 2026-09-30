export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer__copy">
        © {new Date().getFullYear()} KarriärKoll
      </span>
      <nav className="footer__links">
        <a className="footer__link" href="/integritet">
          Integritet
        </a>
        <a className="footer__link" href="/villkor">
          Villkor
        </a>
        <a className="footer__link" href="/kontakt">
          Kontakt
        </a>
      </nav>
    </footer>
  );
}