import { inquiry } from '../data/content';

export interface InquiryFields {
  villa: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  name: string;
  contact: string;
  message: string;
}

export type InquiryErrors = Partial<Record<keyof InquiryFields, string>>;

export const emptyInquiry: InquiryFields = {
  villa: inquiry.helpChoose,
  checkIn: '',
  checkOut: '',
  adults: '',
  children: '0',
  name: '',
  contact: '',
  message: '',
};

const WHOLE = /^\d+$/;

/** Validates dates and guest counts. No property maximums are assumed. */
export function validateInquiry(f: InquiryFields): InquiryErrors {
  const e: InquiryErrors = {};
  const { errors } = inquiry;

  if (!f.checkIn) e.checkIn = errors.checkIn;
  if (!f.checkOut) e.checkOut = errors.checkOut;
  else if (f.checkIn && f.checkOut <= f.checkIn) e.checkOut = errors.order;

  const adults = f.adults.trim();
  if (adults && !WHOLE.test(adults)) e.adults = errors.whole;
  else if (!adults || Number(adults) < 1) e.adults = errors.adults;

  const children = f.children.trim();
  if (children && !WHOLE.test(children)) e.children = errors.whole;

  return e;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

/** Builds the readable message from the copy document's template. */
export function buildInquiryMessage(f: InquiryFields): string {
  const adults = Number(f.adults);
  const children = Number(f.children.trim() || '0');
  const lines = [
    'Hello ARQA team, I would like to ask about a stay.',
    `Preferred villa: ${f.villa}`,
    `Check-in: ${formatDate(f.checkIn)}`,
    `Check-out: ${formatDate(f.checkOut)}`,
    `Guests: ${plural(adults, 'adult', 'adults')}, ${plural(children, 'child', 'children')}`,
  ];
  if (f.name.trim()) lines.push(`Name: ${f.name.trim()}`);
  if (f.contact.trim()) lines.push(`Contact: ${f.contact.trim()}`);
  if (f.message.trim()) lines.push(`Additional details: ${f.message.trim()}`);
  lines.push('Could you please confirm availability, the rate and what is included? Thank you.');
  return lines.join('\n');
}

export function mailtoHref(email: string, body: string): string {
  const subject = 'Stay inquiry for ARQA Palm Villas';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
