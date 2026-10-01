import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./shared/modal";
import { useAuth } from "../context/AuthContext";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialTab: "login" | "register";
};

export default function AuthModal({ isOpen, onClose, initialTab }: AuthModalProps) {
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    // Login-formulärets state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Register-formulärets state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);

    async function handleLoginSubmit(e: FormEvent) {
        e.preventDefault();
        setLoginError(null);
        setIsLoggingIn(true);

        try {
            await login(loginEmail, loginPassword);
            onClose();
            navigate("/dashboard");
        } catch (err) {
            setLoginError("Fel e-post eller lösenord");
        } finally {
            setIsLoggingIn(false);
        }
    }

    async function handleRegisterSubmit(e: FormEvent) {
        e.preventDefault();
        setRegisterError(null);

        if (registerPassword.length < 6) {
            setRegisterError("Lösenordet måste vara minst 6 tecken");
            return;
        }

        if (registerPassword !== confirmPassword) {
            setRegisterError("Lösenorden matchar inte");
            return;
        }

        setIsRegistering(true);

        try {
            await signup(registerEmail, registerPassword, {
                first_name: firstName,
                last_name: lastName,
            });
            onClose();
            navigate("/dashboard");
        } catch (err) {
            setRegisterError("Kunde inte skapa kontot, försök igen");
        } finally {
            setIsRegistering(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={activeTab === "login" ? "Logga in" : "Skapa konto"}
        >
            <div className="auth-tabs">
                <button
                    type="button"
                    className={activeTab === "login" ? "btn btn--primary" : "btn btn--secondary"}
                    onClick={() => setActiveTab("login")}
                >
                    Logga in
                </button>
                <button
                    type="button"
                    className={activeTab === "register" ? "btn btn--primary" : "btn btn--secondary"}
                    onClick={() => setActiveTab("register")}
                >
                    Registrera
                </button>
            </div>

            {activeTab === "login" ? (
                <form onSubmit={handleLoginSubmit}>
                    <div className="field">
                        <label className="label" htmlFor="login-email">
                            E-post
                        </label>
                        <input
                            id="login-email"
                            className="input"
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="login-password">
                            Lösenord
                        </label>
                        <input
                            id="login-password"
                            className="input"
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                    </div>

                    {loginError && <p className="pill pill--rejected">{loginError}</p>}

                    <button type="submit" className="btn btn--primary" disabled={isLoggingIn}>
                        {isLoggingIn ? "Loggar in..." : "Logga in"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegisterSubmit}>
                    <div className="grid grid-2">
                        <div className="field">
                            <label className="label" htmlFor="register-first-name">
                                Förnamn
                            </label>
                            <input
                                id="register-first-name"
                                className="input"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="field">
                            <label className="label" htmlFor="register-last-name">
                                Efternamn
                            </label>
                            <input
                                id="register-last-name"
                                className="input"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="register-email">
                            E-post
                        </label>
                        <input
                            id="register-email"
                            className="input"
                            type="email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="register-password">
                            Lösenord
                        </label>
                        <input
                            id="register-password"
                            className="input"
                            type="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="register-confirm-password">
                            Upprepa lösenord
                        </label>
                        <input
                            id="register-confirm-password"
                            className="input"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {registerError && <p className="pill pill--rejected">{registerError}</p>}

                    <button type="submit" className="btn btn--primary" disabled={isRegistering}>
                        {isRegistering ? "Skapar konto..." : "Registrera"}
                    </button>
                </form>
            )}
        </Modal>
    );
}