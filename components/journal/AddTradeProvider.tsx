"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AddTradeModal } from "@/components/journal/AddTradeModal";

interface AddTradeContextValue {
  open: () => void;
}

const AddTradeContext = createContext<AddTradeContextValue | null>(null);

/** Hosts a single Add Trade modal and exposes open() to descendant triggers. */
export function AddTradeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AddTradeContext value={{ open }}>
      {children}
      <AddTradeModal open={isOpen} onClose={close} />
    </AddTradeContext>
  );
}

export function useAddTrade(): AddTradeContextValue {
  const ctx = useContext(AddTradeContext);
  if (!ctx) {
    throw new Error("useAddTrade must be used within an AddTradeProvider");
  }
  return ctx;
}
