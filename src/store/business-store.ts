import { create } from "zustand";
import { Business } from "@/services/business-service";

interface BusinessState {
  business: Business | null;
  setBusiness: (business: Business) => void;
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  business: null,
  setBusiness: (business) => set({ business }),
  clearBusiness: () => set({ business: null }),
}));