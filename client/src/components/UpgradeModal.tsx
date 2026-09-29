import { useState } from "react";
import Modal from "./shared/modal";
import ModalFooter from "./shared/modalFooter";
import { apiFetch } from "../lib/api";
import { useUpgradeModal } from "../context/UpgradeModalContext";
import type { PaymentReceipt } from "../types/payment";

type Level = { id: number; name: string; price: string; priceValue: number; description: string };

const LEVELS: Level[] = [
  { id: 1, name: "Grundpaket", price: "0 kr", priceValue: 0, description: "Kom igång gratis med grunderna." },
  { id: 2, name: "Plus", price: "79 kr/mån", priceValue: 79, description: "Mer innehåll: diagram, export och fler ansökningar." },
  { id: 3, name: "Premium", price: "149 kr/mån", priceValue: 149, description: "Allt innehåll: insikter, påminnelser och obegränsat." },
];

type Step = "select" | "card" | "receipt";

type CardForm = {
  firstName: string;
  lastName: string;
  address: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const EMPTY_CARD_FORM: CardForm = {
  firstName: "",
  lastName: "",
  address: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

// Formaterar "1234567812345678" -> "1234 5678 1234 5678" medan man skriver
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export default function UpgradeModal() {
  const { isOpen, closeUpgradeModal } = useUpgradeModal();
  const [step, setStep] = useState<Step>("select");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [cardForm, setCardForm] = useState<CardForm>(EMPTY_CARD_FORM);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetState() {
    setStep("select");
    setSelectedLevel(null);
    setCardForm(EMPTY_CARD_FORM);
    setReceipt(null);
    setError(null);
  }

  function handleClose() {
    // Köpet gick igenom — ladda om sidan så att paywalls/usage-data blir fräscha
    if (receipt) {
      window.location.reload();
      return;
    }
    closeUpgradeModal();
    setTimeout(resetState, 200);
  }

  async function purchase(levelId: number) {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<PaymentReceipt>("/api/payments", {
        method: "POST",
        body: JSON.stringify({ subscription_level_id: levelId }),
      });
      setReceipt(data);
      setStep("receipt");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectLevel(level: Level) {
    setError(null);
    setSelectedLevel(level);
    if (level.priceValue === 0) {
      purchase(level.id);
    } else {
      setStep("card");
    }
  }

  function handleCardSubmit(event: React.FormEvent) {
    event.preventDefault();
    const { firstName, lastName, address, cardNumber, expiry, cvc } = cardForm;
    if (!firstName || !lastName || !address || !expiry || !cvc) {
      setError("Fyll i alla fält.");
      return;
    }
    if (cardNumber.replace(/\D/g, "").length !== 16) {
      setError("Kortnumret måste vara 16 siffror.");
      return;
    }
    if (!selectedLevel) return;
    purchase(selectedLevel.id);
  }

  const title =
    step === "receipt" ? "Kvitto" : step === "card" ? `Betala för ${selectedLevel?.name}` : "Uppgradera";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      {step === "receipt" && receipt ? (
        <div>
          {receipt.is_free ? (
            <p>
              Du använder nu <strong>{receipt.level_name}</strong>.
            </p>
          ) : (
            <>
              <p className="muted">Tack för ditt köp!</p>
              <div className="card">
                <p><strong>Nivå:</strong> {receipt.level_name}</p>
                <p><strong>Belopp:</strong> {receipt.total} kr</p>
                <p><strong>Status:</strong> {receipt.status}</p>
                <p className="faint">
                  Kvitto-id: {receipt.id}
                  <br />
                  {new Date(receipt.paid_at ?? receipt.created_at ?? Date.now()).toLocaleString("sv-SE")}
                </p>
              </div>
            </>
          )}
        </div>
      ) : step === "card" && selectedLevel ? (
        <form onSubmit={handleCardSubmit}>
          <p className="subtitle">
            {selectedLevel.name} — {selectedLevel.price}
          </p>
          {error && <p className="pill pill--rejected">{error}</p>}

          <div className="grid grid-2">
            <div className="field">
              <label className="label">Förnamn</label>
              <input
                className="input"
                value={cardForm.firstName}
                onChange={(e) => setCardForm({ ...cardForm, firstName: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="label">Efternamn</label>
              <input
                className="input"
                value={cardForm.lastName}
                onChange={(e) => setCardForm({ ...cardForm, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Adress</label>
            <input
              className="input"
              value={cardForm.address}
              onChange={(e) => setCardForm({ ...cardForm, address: e.target.value })}
            />
          </div>

          <div className="field">
            <label className="label">Kortnummer</label>
            <input
              className="input"
              placeholder="1234 5678 1234 5678"
              value={cardForm.cardNumber}
              onChange={(e) => setCardForm({ ...cardForm, cardNumber: formatCardNumber(e.target.value) })}
            />
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label className="label">Giltig till (MM/ÅÅ)</label>
              <input
                className="input"
                placeholder="12/28"
                value={cardForm.expiry}
                onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="label">CVC</label>
              <input
                className="input"
                placeholder="123"
                value={cardForm.cvc}
                onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
              />
            </div>
          </div>

          <ModalFooter>
            <button type="button" className="btn btn--secondary" onClick={() => setStep("select")}>
              Tillbaka
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Behandlar…" : `Betala ${selectedLevel.price}`}
            </button>
          </ModalFooter>
        </form>
      ) : (
        <>
          <p className="subtitle">Välj den nivå du vill uppgradera till.</p>
          {error && <p className="pill pill--rejected">{error}</p>}
          <div className="grid grid-3">
            {LEVELS.map((level) => (
              <div className="card center" key={level.id}>
                <h3>{level.name}</h3>
                <p className="stat__value">{level.price}</p>
                <p className="muted">{level.description}</p>
                <button
                  type="button"
                  className="btn btn--primary"
                  disabled={loading}
                  onClick={() => handleSelectLevel(level)}
                >
                  Välj {level.name}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {step !== "card" && (
        <ModalFooter>
          <button type="button" className="btn btn--secondary" onClick={handleClose}>
            Stäng
          </button>
        </ModalFooter>
      )}
    </Modal>
  );
}