import { create } from 'zustand';

export const useZonesStore = create((set) => ({
  zones: [],
  loading: false,
  setZones: (zones) => set({ zones }),
  setLoading: (loading) => set({ loading }),
}));
