import { create } from 'zustand';

export interface FarmerProfile {
  id: number;
  full_name: string;
  phone_number: string;
  role: 'FARMER' | 'FPO';
  state: string;
  district: string;
  village: string;
}

interface FarmerAuthStore {
  farmer: FarmerProfile | null;
  token: string | null;
  setFarmer: (farmer: FarmerProfile | null, token: string | null) => void;
}

export const useFarmerAuthStore = create<FarmerAuthStore>((set) => ({
  farmer: {
    id: 12,
    full_name: "Gurpreet Singh",
    phone_number: "+91 98765 43210",
    role: "FARMER",
    state: "Punjab",
    district: "Ludhiana",
    village: "Samrala"
  },
  token: "farmer_demo_jwt_token",
  setFarmer: (farmer, token) => set({ farmer, token }),
}));
