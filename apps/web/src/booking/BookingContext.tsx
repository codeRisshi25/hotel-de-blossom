import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { InquiryPurpose } from "@hdb/shared";
import { fetchRates, type PublicRate } from "../lib/api";
import { rooms } from "../content/site";

export type BookingPrefill = Partial<{ purpose: InquiryPurpose; roomType: string; checkIn: string; checkOut: string; guests: number }>;

type BookingContextValue = {
  isOpen: boolean;
  prefill: BookingPrefill;
  openBooking: (prefill?: BookingPrefill) => void;
  closeBooking: () => void;
  priceFor: (rateKey: string, fallback: number) => number;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});
  const [rates, setRates] = useState<PublicRate[]>([]);

  useEffect(() => { void fetchRates().then(setRates).catch(() => setRates([])); }, []);

  const openBooking = useCallback((next: BookingPrefill = {}) => { setPrefill(next); setOpen(true); }, []);
  const closeBooking = useCallback(() => setOpen(false), []);
  const priceFor = useCallback((rateKey: string, fallback: number) => {
    const key = rateKey.toLowerCase();
    const match = rates.find((rate) => rate.roomType.toLowerCase().includes(key) || key.includes(rate.roomType.toLowerCase()));
    return match?.baseNightlyInr || fallback;
  }, [rates]);

  const value = useMemo(() => ({ isOpen, prefill, openBooking, closeBooking, priceFor }), [isOpen, prefill, openBooking, closeBooking, priceFor]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used inside BookingProvider");
  return context;
};

export const roomOptions = rooms.map((room) => room.name);
