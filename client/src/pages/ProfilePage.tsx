import { useEffect, useState, type FormEvent } from "react";
import { apiFetch } from "../lib/api";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useUpgradeModal } from "../context/UpgradeModalContext";
import type { Profile } from "../types/profile";

function ProfilePage() {
  const { user } = useAuth();
  const { openUpgradeModal } = useUpgradeModal();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMessage, setNameMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch<Profile>("/api/profile");
        setProfile(data);
        setFirstName(data.first_name ?? "");
        setLastName(data.last_name ?? "");
      } catch (err) {
        console.error("Kunde inte hämta profil:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleNameSubmit(e: FormEvent) {
    e.preventDefault();
    setNameSaving(true);
    setNameError(null);
    setNameMessage(null);
    try {
      const data = await apiFetch<{ first_name: string; last_name: string }>("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ first_name: firstName, last_name: lastName }),
      });
      setProfile((prev) => (prev ? { ...prev, ...data } : prev));
      setNameMessage("Sparat!");
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setNameSaving(false);
    }
  }

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setEmailSaving(true);
    setEmailError(null);
    setEmailMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setEmailMessage("Kolla din nya inkorg — du måste bekräfta bytet via mejlet som skickats.");
      setNewEmail("");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setEmailSaving(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordError("Lösenordet måste vara minst 6 tecken");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Lösenorden matchar inte");
      return;
    }

    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMessage("Lösenordet är uppdaterat.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <p className="muted">Laddar profil…</p>
      </div>
    );
  }

  return (
    <section className="container">
      <h1>Profil</h1>
      <p className="subtitle">Hantera dina kontouppgifter och ditt medlemskap.</p>

      <div className="grid grid-2">
        <form className="card" onSubmit={handleNameSubmit}>
          <h3>Kontouppgifter</h3>
          <div className="field">
            <label className="label">E-post</label>
            <input className="input" value={user?.email ?? ""} disabled />
          </div>
          <div className="field">
            <label className="label">Förnamn</label>
            <input
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="label">Efternamn</label>
            <input
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          {nameError && <p className="pill pill--rejected">{nameError}</p>}
          {nameMessage && <p className="muted">{nameMessage}</p>}
          <button type="submit" className="btn btn--primary" disabled={nameSaving}>
            {nameSaving ? "Sparar…" : "Spara namn"}
          </button>
        </form>

        <div className="card">
          <h3>Medlemskap</h3>
          <p className="muted">
            Du använder just nu <strong>{profile?.level_name}</strong>.
          </p>
          <button type="button" className="btn btn--primary" onClick={openUpgradeModal}>
            Uppgradera
          </button>
        </div>

        <form className="card" onSubmit={handleEmailSubmit}>
          <h3>Byt e-post</h3>
          <div className="field">
            <label className="label">Ny e-post</label>
            <input
              className="input"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          {emailError && <p className="pill pill--rejected">{emailError}</p>}
          {emailMessage && <p className="muted">{emailMessage}</p>}
          <button type="submit" className="btn btn--secondary" disabled={emailSaving}>
            {emailSaving ? "Sparar…" : "Byt e-post"}
          </button>
        </form>

        <form className="card" onSubmit={handlePasswordSubmit}>
          <h3>Byt lösenord</h3>
          <div className="field">
            <label className="label">Nytt lösenord</label>
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="label">Upprepa lösenord</label>
            <input
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {passwordError && <p className="pill pill--rejected">{passwordError}</p>}
          {passwordMessage && <p className="muted">{passwordMessage}</p>}
          <button type="submit" className="btn btn--secondary" disabled={passwordSaving}>
            {passwordSaving ? "Sparar…" : "Byt lösenord"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProfilePage;