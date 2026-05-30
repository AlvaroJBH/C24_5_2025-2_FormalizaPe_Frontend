import { create } from "zustand";
import { Business, getBusinessById } from "@/services/business-service";

interface BusinessState {
  business: Business | null;
  setBusiness: (business: Business) => void;
  clearBusiness: () => void;
  refreshBusiness: (businessId: number) => Promise<void>;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  business: null,
  setBusiness: (business) => set({ business }),
  clearBusiness: () => set({ business: null }),
  refreshBusiness: async (businessId: number) => {
    const updated = await getBusinessById(businessId);
    set({ business: updated });
  },
}));