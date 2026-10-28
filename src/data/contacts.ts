/**
 * Inquiry destinations. Unknown or unverified contacts stay null and their
 * actions are hidden. Set `email` only after the owner confirms the address is
 * current and used for bookings; set `whatsapp` only with a confirmed
 * WhatsApp Business number.
 */
export const contacts = {
  facebook: 'https://www.facebook.com/arqapalmvillas',
  instagram: 'https://www.instagram.com/arqapalmvillas/',
  email: null as string | null,
  whatsapp: null as string | null,
};

export const credit = {
  label: 'Lendez Studio',
  href: 'https://lendezstudio.com/',
};
