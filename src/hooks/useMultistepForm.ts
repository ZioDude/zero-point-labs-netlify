"use client";

import { useState } from "react";

export function useMultistepForm() {
  const [isOpen, setIsOpen] = useState(false);

  const openForm = () => setIsOpen(true);
  const closeForm = () => setIsOpen(false);

  return {
    isOpen,
    openForm,
    closeForm
  };
} 