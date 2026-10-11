import { useMemo, useRef, useState } from "react";
import { Copy, ExternalLink, MessageCircle } from "lucide-react";
import type { Inquiry } from "../lib/staff-api";

type Template = { id: string; label: string; message: string };

const dateLabel = (value: string | null) => value
  ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`))
  : "To be confirmed";

function templatesFor(inquiry: Inquiry): Template[] {
  const name = inquiry.guest_name;
  const ref = inquiry.reference_code;
  const dates = inquiry.check_in
    ? `${dateLabel(inquiry.check_in)}${inquiry.check_out ? ` to ${dateLabel(inquiry.check_out)}` : ""}`
    : "your requested dates";

  if (inquiry.purpose === "event") {
    return [
      { id: "received", label: "Enquiry received", message: `Hello ${name},\n\nThank you for contacting Hotel De Blossom about your event at Summit Hall (ref ${ref}). Our team is reviewing your requirements and will get back to you shortly.\n\nHotel De Blossom` },
      { id: "follow-up", label: "Discuss event details", message: `Hello ${name},\n\nFollowing up on your Summit Hall enquiry (${ref})${inquiry.check_in ? ` for ${dateLabel(inquiry.check_in)}` : ""}${inquiry.guests ? `, for approximately ${inquiry.guests} guests` : ""}.\n\nPlease let us know a convenient time to discuss the event layout, menu and package options.\n\nHotel De Blossom` },
      { id: "custom", label: "Custom message", message: `Hello ${name},\n\nRegarding your Summit Hall enquiry (${ref}):\n\nHotel De Blossom` },
    ];
  }

  if (inquiry.purpose === "stay" || inquiry.purpose === "group_stay") {
    return [
      { id: "received", label: "Enquiry received", message: `Hello ${name},\n\nWe have received your stay enquiry (${ref}) for ${dates}${inquiry.room_type ? `, with a preference for ${inquiry.room_type}` : ""}. Our front desk is checking availability and will update you shortly.\n\nHotel De Blossom` },
      { id: "available", label: "Dates available", message: `Hello ${name},\n\nWe have availability for ${dates}${inquiry.room_type ? ` in the ${inquiry.room_type}` : ""}. The quoted rate is ₹[amount] per night${inquiry.guests ? ` for ${inquiry.guests} guest${inquiry.guests === 1 ? "" : "s"}` : ""}.\n\nPlease reply if you would like us to proceed. Your booking is confirmed only after our team confirms it with you.\n\nHotel De Blossom · Ref ${ref}` },
      { id: "unavailable", label: "Dates unavailable", message: `Hello ${name},\n\nThank you for your stay enquiry (${ref}). Unfortunately, we do not have availability for ${dates}${inquiry.room_type ? ` in the ${inquiry.room_type}` : ""}.\n\nIf your dates are flexible, please share an alternative and we will be happy to check.\n\nHotel De Blossom` },
      { id: "follow-up", label: "Follow up", message: `Hello ${name},\n\nWe are following up on your stay enquiry (${ref}) for ${dates}. Please let us know if you would like any help with dates, room options or the quoted tariff.\n\nHotel De Blossom` },
      { id: "custom", label: "Custom message", message: `Hello ${name},\n\nRegarding your stay enquiry (${ref}):\n\nHotel De Blossom` },
    ];
  }

  return [
    { id: "received", label: "Enquiry received", message: `Hello ${name},\n\nThank you for contacting Hotel De Blossom. We have received your enquiry (${ref}) and our team will get back to you shortly.\n\nHotel De Blossom` },
    { id: "follow-up", label: "Follow up", message: `Hello ${name},\n\nWe are following up on your enquiry (${ref}). Please let us know if we can help with anything else.\n\nHotel De Blossom` },
    { id: "custom", label: "Custom message", message: `Hello ${name},\n\nRegarding your enquiry (${ref}):\n\nHotel De Blossom` },
  ];
}

export function WhatsAppComposer({ inquiry }: { inquiry: Inquiry }) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const templates = useMemo(() => templatesFor(inquiry), [inquiry]);
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [message, setMessage] = useState(templates[0]?.message ?? "");
  const [copied, setCopied] = useState(false);
  const digits = inquiry.phone.replace(/\D/g, "");
  const phone = digits.length === 10 ? `91${digits}` : digits;

  const selectTemplate = (id: string) => {
    const template = templates.find((item) => item.id === id);
    if (!template) return;
    setTemplateId(id);
    setMessage(template.message);
    setCopied(false);
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      messageRef.current?.focus();
      messageRef.current?.select();
      document.execCommand("copy");
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return <section className="border border-[rgba(22,56,49,.14)] bg-[#fbf8f0] p-4">
    <div className="flex items-center gap-2 text-[var(--forest)]"><MessageCircle size={16} className="text-[var(--gold)]" /><h3 className="font-mono text-[9px] uppercase tracking-[.15em]">WhatsApp guest templates</h3></div>
    <p className="mt-2 text-xs leading-5 text-[rgba(23,24,21,.58)]">Choose a scenario, review the wording, then open WhatsApp to send it.</p>
    <label className="mt-4 grid gap-1.5 text-xs font-semibold text-[var(--forest)]">Message scenario
      <select value={templateId} onChange={(event) => selectTemplate(event.target.value)} className="min-h-10 border border-[rgba(22,56,49,.18)] bg-white px-3 text-sm font-normal outline-none focus:border-[var(--gold)]">
        {templates.map((template) => <option key={template.id} value={template.id}>{template.label}</option>)}
      </select>
    </label>
    <label className="mt-3 grid gap-1.5 text-xs font-semibold text-[var(--forest)]">Review and edit message
      <textarea ref={messageRef} value={message} onChange={(event) => setMessage(event.target.value)} rows={7} maxLength={2000} className="w-full resize-y border border-[rgba(22,56,49,.18)] bg-white p-3 text-sm font-normal leading-6 outline-none focus:border-[var(--gold)]" />
    </label>
    {message.includes("[amount]") && <p className="mt-2 text-xs text-[#7a4b10]">Replace [amount] with the approved quote before sending.</p>}
    <div className="mt-3 flex flex-wrap gap-2">
      <a href={phone && message.trim() ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : undefined} target="_blank" rel="noreferrer" aria-disabled={!phone || !message.trim()} className={`inline-flex min-h-10 items-center gap-2 bg-[var(--forest)] px-3 text-xs font-semibold text-[var(--ivory)] ${phone && message.trim() ? "hover:bg-[var(--night)]" : "pointer-events-none opacity-45"}`}><ExternalLink size={14} />Open WhatsApp</a>
      <button type="button" onClick={() => void copyMessage()} disabled={!message.trim()} className="inline-flex min-h-10 items-center gap-2 border border-[rgba(22,56,49,.18)] px-3 text-xs font-semibold text-[var(--forest)] hover:bg-white"><Copy size={14} />{copied ? "Copied" : "Copy message"}</button>
    </div>
  </section>;
}
