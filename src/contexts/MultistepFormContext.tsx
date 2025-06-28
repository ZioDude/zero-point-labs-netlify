"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useMultistepForm } from "@/hooks/useMultistepForm";
import MultistepForm from "@/components/ui/multistep-form";

interface MultistepFormContextType {
  openForm: () => void;
  closeForm: () => void;
  isOpen: boolean;
}

const MultistepFormContext = createContext<MultistepFormContextType | undefined>(undefined);

export function MultistepFormProvider({ children }: { children: ReactNode }) {
  const { isOpen, openForm, closeForm } = useMultistepForm();

  return (
    <MultistepFormContext.Provider value={{ isOpen, openForm, closeForm }}>
      {children}
      <MultistepForm isOpen={isOpen} onClose={closeForm} />
    </MultistepFormContext.Provider>
  );
}

export function useMultistepFormContext() {
  const context = useContext(MultistepFormContext);
  if (context === undefined) {
    throw new Error("useMultistepFormContext must be used within a MultistepFormProvider");
  }
  return context;
} 