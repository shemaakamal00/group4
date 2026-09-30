export default function Footer() {
  const today = new Date().toLocaleDateString("sv-SE");

  return (
    <footer className="footer">
      <span className="footer__copy">
        © {new Date().getFullYear()} KarriärKoll
      </span>
      <span className="footer__copy">Grupp 4 · Byggt {today}</span>
    </footer>
  );
}