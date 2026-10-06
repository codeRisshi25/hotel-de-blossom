import { Link } from "react-router";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Facebook, Instagram } from "./BrandIcons";
import { hotel } from "../content/site";
import { navLinks } from "./SiteHeader";
import { useBooking } from "../booking/BookingContext";

export function SiteFooter() {
  const { openBooking } = useBooking();
  return (
    <footer className="royal-pattern relative overflow-hidden text-ivory">
      <div className="mx-auto max-w-[1500px] px-5 pb-28 pt-24 md:px-10 md:pb-12">
        <div className="grid items-end gap-10 border-b border-ivory/10 pb-16 md:grid-cols-[1.4fr_1fr]">
          <div>
            <img src="/images/brand/emblem.webp" alt="" aria-hidden width={130} height={59} className="mb-8 h-14 w-auto" />
            <p className="display text-5xl leading-[.95] md:text-7xl">
              Your room is
              <br />
              <em className="gold-text">waiting in bloom.</em>
            </p>
          </div>
          <div className="grid gap-4 md:justify-items-end">
            <p className="max-w-sm text-ivory/65 md:text-right">Send a request and our front desk will personally confirm your dates, room and tariff.</p>
            <button onClick={() => openBooking()} className="group inline-flex min-h-13 w-fit items-center gap-3 rounded-full bg-gold pl-6 pr-2 text-[15px] font-semibold text-night">
              Request a booking
              <span className="grid h-10 w-10 place-items-center rounded-full bg-night text-ivory transition group-hover:rotate-45"><ArrowUpRight size={17} /></span>
            </button>
          </div>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/images/brand/logo-stacked-light.webp" alt="Hotel De Blossom" width={150} height={113} className="h-24 w-auto" />
          </div>
          <div>
            <p className="eyebrow mb-5 text-sandstone">Explore</p>
            <ul className="grid gap-2.5 text-ivory/75">
              {navLinks.map((link) => <li key={link.to}><Link className="transition hover:text-gold-soft" to={link.to}>{link.label}</Link></li>)}
              <li><Link className="transition hover:text-gold-soft" to="/dining#menu">Restaurant menu</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-sandstone">Visit</p>
            <a href={hotel.mapsUrl} target="_blank" rel="noreferrer" className="flex gap-3 text-ivory/75 transition hover:text-gold-soft">
              <MapPin size={18} className="mt-1 shrink-0 text-gold" />
              <span>{hotel.address.map((line) => <span key={line} className="block">{line}</span>)}</span>
            </a>
          </div>
          <div>
            <p className="eyebrow mb-5 text-sandstone">Front desk · 24×7</p>
            <ul className="grid gap-3 text-ivory/75">
              <li><a className="flex items-center gap-3 hover:text-gold-soft" href={hotel.phoneHref}><Phone size={16} className="text-gold" />{hotel.phone}</a></li>
              <li><a className="flex items-center gap-3 hover:text-gold-soft" href={`mailto:${hotel.email}`}><Mail size={16} className="text-gold" />{hotel.email}</a></li>
              <li className="flex gap-3 pt-2">
                <a aria-label="Instagram" href={hotel.socials.instagram} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-ivory/15 hover:border-gold hover:text-gold-soft"><Instagram size={17} /></a>
                <a aria-label="Facebook" href={hotel.socials.facebook} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-ivory/15 hover:border-gold hover:text-gold-soft"><Facebook size={17} /></a>
              </li>
            </ul>
          </div>
        </div>

        <div aria-hidden className="royal pointer-events-none select-none whitespace-nowrap text-center text-[12.5vw] leading-[.8] text-ivory/[.05]">DE BLOSSOM</div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-ivory/10 pt-6 text-xs text-ivory/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Hotel De Blossom, Guwahati. All rights reserved.</p>
          <p>Booking requests are confirmed by our front desk.</p>
        </div>
      </div>
    </footer>
  );
}
