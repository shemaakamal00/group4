import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function HomePage() {
  return (
    <div>
     <Header isLoggedIn={false} />
      <Footer />
    </div>
  );
}