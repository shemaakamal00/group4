import Modal from "./shared/modal";

type PriserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Level = {
  name: string;
  price: string;
  description: string;
  applications: string;
  goals: string;
};

const LEVELS: Level[] = [
  {
    name: "Grundpaket",
    price: "0 kr",
    description: "Kom igång gratis med grunderna.",
    applications: "Upp till 10 ansökningar",
    goals: "Mål ej tillgängligt",
  },
  {
    name: "Plus",
    price: "79 kr/mån",
    description: "Mer innehåll: diagram, export och fler ansökningar.",
    applications: "Upp till 50 ansökningar",
    goals: "Upp till 2 mål",
  },
  {
    name: "Premium",
    price: "149 kr/mån",
    description: "Allt innehåll: insikter, påminnelser och obegränsat.",
    applications: "Obegränsat antal ansökningar",
    goals: "Obegränsat antal mål",
  },
];

export default function PriserModal({ isOpen, onClose }: PriserModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Priser">
      <p className="subtitle">
        Välj den nivå som passar dig bäst — du kan alltid uppgradera senare.
      </p>
      <div className="grid grid-3">
        {LEVELS.map((level) => (
          <div className="card" key={level.name}>
            <h3>{level.name}</h3>
            <p className="stat__value">{level.price}</p>
            <p className="muted">{level.description}</p>
            <p className="faint">{level.applications}</p>
            <p className="faint">{level.goals}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}