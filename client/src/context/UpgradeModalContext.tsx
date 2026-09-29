import { createContext, useContext, useState, type ReactNode } from "react";

type UpgradeModalContextValue = {
  isOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
};

const UpgradeModalContext = createContext<UpgradeModalContextValue | undefined>(undefined);

export function UpgradeModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value: UpgradeModalContextValue = {
    isOpen,
    openUpgradeModal: () => setIsOpen(true),
    closeUpgradeModal: () => setIsOpen(false),
  };

  return (
    <UpgradeModalContext.Provider value={value}>
      {children}
    </UpgradeModalContext.Provider>
  );
}

export function useUpgradeModal() {
  const context = useContext(UpgradeModalContext);
  if (!context) {
    throw new Error("useUpgradeModal måste användas inuti en UpgradeModalProvider");
  }
  return context;
}