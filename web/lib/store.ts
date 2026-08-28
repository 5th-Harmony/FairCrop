import { create } from 'zustand';

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: 'FARMER' | 'FPO' | 'BUYER' | 'LOGISTICS' | 'ADMIN';
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  company_name?: string;
  state: string;
  district: string;
}

export interface ProduceLot {
  id: number;
  farmer_id: number;
  crop_name: string;
  variety?: string;
  quantity_kg: number;
  price_per_kg_expected: number;
  grade: string;
  harvest_date: string;
  storage_location: string;
  state: string;
  district: string;
  status: string;
  image_urls?: string[];
  farmer?: UserProfile;
  match_score_percentage?: number;
}

interface AppState {
  user: UserProfile | null;
  token: string | null;
  selectedLotForBidding: ProduceLot | null;
  setUser: (user: UserProfile | null, token: string | null) => void;
  setSelectedLotForBidding: (lot: ProduceLot | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: 101,
    email: "buyer@agritech.org",
    full_name: "Reliance Retail Agri Procurement",
    role: "BUYER",
    verification_status: "VERIFIED",
    company_name: "Reliance Retail Ltd",
    state: "Punjab",
    district: "Ludhiana"
  },
  token: "demo_jwt_token",
  selectedLotForBidding: null,
  setUser: (user, token) => {
    if (token) localStorage.setItem('agritech_jwt_token', token);
    set({ user, token });
  },
  setSelectedLotForBidding: (lot) => set({ selectedLotForBidding: lot }),
  logout: () => {
    localStorage.removeItem('agritech_jwt_token');
    set({ user: null, token: null });
  }
}));
