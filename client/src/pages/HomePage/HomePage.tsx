import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import AuthModal from '../../components/AuthModal';
import PriserModal from '../../components/PriserModal';
import OmOssModal from '../../components/OmOssModal';
import { useAuth } from '../../context/AuthContext';

export default function HomePage() {
  const { user, logout } = useAuth();
  const [authModalTab, setAuthModalTab] = useState<"login" | "register" | null>(null);
  const [isPriserOpen, setIsPriserOpen] = useState(false);
  const [isOmOssOpen, setIsOmOssOpen] = useState(false);

  return (
    <div>
      <Header
        isLoggedIn={!!user}
        onLoginClick={() => setAuthModalTab("login")}
        onGetStartedClick={() => setAuthModalTab("register")}
        onLogoutClick={() => logout()}
        onPriserClick={() => setIsPriserOpen(true)}
        onOmOssClick={() => setIsOmOssOpen(true)}
      />
      <Footer />
      <AuthModal
        isOpen={authModalTab !== null}
        initialTab={authModalTab ?? "login"}
        onClose={() => setAuthModalTab(null)}
      />
      <PriserModal isOpen={isPriserOpen} onClose={() => setIsPriserOpen(false)} />
      <OmOssModal isOpen={isOmOssOpen} onClose={() => setIsOmOssOpen(false)} />
    </div>
  );
}