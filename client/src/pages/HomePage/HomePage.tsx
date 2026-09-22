import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import AuthModal from '../../components/AuthModal';
import { useAuth } from '../../context/AuthContext';

export default function HomePage() {
  const { user, logout } = useAuth();
  const [authModalTab, setAuthModalTab] = useState<"login" | "register" | null>(null);

  return (
    <div>
      <Header
        isLoggedIn={!!user}
        onLoginClick={() => setAuthModalTab("login")}
        onGetStartedClick={() => setAuthModalTab("register")}
        onLogoutClick={() => logout()}
      />
      <Footer />
      <AuthModal
        isOpen={authModalTab !== null}
        initialTab={authModalTab ?? "login"}
        onClose={() => setAuthModalTab(null)}
      />
    </div>
  );
}