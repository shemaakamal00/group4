import { useEffect, useState, type FormEvent } from "react";
import Modal from "./shared/modal";
import { useAuth } from "../context/AuthContext";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialTab: "login" | "register";
};

export default function AuthModal({ isOpen, onClose, initialTab }: AuthModalProps) {
    const { login, signup } = useAuth();
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
        } catch (err) {
            setRegisterError("Kunde inte skapa kontot, försök igen");
        } finally {
            setIsRegistering(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <button type="button" onClick={() => setActiveTab("login")}>Logga in</button>
                <button type="button" onClick={() => setActiveTab("register")}>Registrera</button>
            </div>

            {activeTab === "login" ? (
                <form onSubmit={handleLoginSubmit}>
                    <label>
                        E-post
                        <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Lösenord
                        <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                    </label>

                    {loginError && <p style={{ color: "red" }}>{loginError}</p>}

                    <button type="submit" disabled={isLoggingIn}>
                        {isLoggingIn ? "Loggar in..." : "Logga in"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegisterSubmit}>
                    <label>
                        Förnamn
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Efternamn
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        E-post
                        <input
                            type="email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Lösenord
                        <input
                            type="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Upprepa lösenord
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>

                    {registerError && <p style={{ color: "red" }}>{registerError}</p>}

                    <button type="submit" disabled={isRegistering}>
                        {isRegistering ? "Skapar konto..." : "Registrera"}
                    </button>
                </form>
            )}
        </Modal>
    );
}