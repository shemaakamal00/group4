import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

type SignUpMetadata = {
    first_name?: string;
    last_name?: string;
};

type AuthContextValue = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, metadata?: SignUpMetadata) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => {
            subscription.subscription.unsubscribe();
        };
    }, []);

async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
}

async function signup(email: string, password: string, metadata?: SignUpMetadata) {
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
    });
    if (error) throw error;
}

async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    login,
    signup,
    logout,
};

return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error ("useAuth måste användas inuti en AuthProvider");
    }
    return context;
}