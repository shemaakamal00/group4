import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import AuthModal from '../../components/AuthModal';
import PriserModal from '../../components/PriserModal';
import OmOssModal from '../../components/OmOssModal';
import { useAuth } from '../../context/AuthContext';

type HeroProps = {
  onGetStartedClick: () => void;
};

function Hero({ onGetStartedClick }: HeroProps) {
  return (
    <section className="container center">
      <p className="eyebrow">Din karriär, samlad</p>
      <h1 className="display">Håll koll på hela din karriärresa</h1>
      <p className="subtitle">
        Samla dina ansökningar, intervjuer och mål på ett ställe — och se
        dina framsteg växa fram, steg för steg.
      </p>
      <div className="row-center">
        <button
          type="button"
          className="btn btn--primary btn--pill"
          onClick={onGetStartedClick}
        >
          Kom igång gratis
        </button>
      </div>
      <p className="faint">Gratis att komma igång · Inget kort krävs</p>
    </section>
  );
}

type Feature = {
  icon: string;
  colorClass: string;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: "💼",
    colorClass: "feature-icon--tan",
    title: "Spåra ansökningar",
    description: "Följ varje jobb från ansökan till besked på en tydlig tavla.",
  },
  {
    icon: "🎯",
    colorClass: "feature-icon--pink",
    title: "Sätt mål",
    description: "Bryt ner dina karriärmål i delmål och följ framstegen.",
  },
  {
    icon: "📈",
    colorClass: "feature-icon--green",
    title: "Se statistik",
    description: "Upptäck mönster i ditt jobbsökande och vad som ger resultat.",
  },
];

function FeatureCards() {
  return (
    <section className="container">
      <div className="grid grid-3">
        {FEATURES.map((feature) => (
          <div className="card center" key={feature.title}>
            <div className={`feature-icon ${feature.colorClass}`}>
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p className="muted">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

type CtaBannerProps = {
  onGetStartedClick: () => void;
};

function CtaBanner({ onGetStartedClick }: CtaBannerProps) {
  return (
    <section className="container">
      <div className="cta-banner">
        <h2>Redo att ta kontroll över din jobbjakt?</h2>
        <p>Skapa ett konto på under en minut.</p>
        <div className="row-center">
          <button
            type="button"
            className="btn btn--secondary btn--pill"
            onClick={onGetStartedClick}
          >
            Kom igång gratis
          </button>
        </div>
      </div>
    </section>
  );
}

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
      <Hero onGetStartedClick={() => setAuthModalTab("register")} />
      <FeatureCards />
      <CtaBanner onGetStartedClick={() => setAuthModalTab("register")} />
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