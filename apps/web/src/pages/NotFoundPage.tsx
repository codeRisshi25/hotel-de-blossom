import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section className="royal-pattern grid min-h-[90vh] place-items-center px-5 text-center text-ivory">
      <div>
        <img src="/images/brand/emblem-sm.webp" alt="" aria-hidden width={280} height={127} className="mx-auto h-16 w-auto" />
        <p className="royal mt-8 text-7xl text-gold-soft">404</p>
        <h1 className="display mt-4 text-4xl">This path hasn't bloomed yet.</h1>
        <Link to="/" className="mt-10 inline-flex min-h-13 items-center rounded-full bg-gold px-7 font-semibold text-night">Return home</Link>
      </div>
    </section>
  );
}
