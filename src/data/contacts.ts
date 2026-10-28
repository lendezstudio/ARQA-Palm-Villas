/**
 * Inquiry destinations and location. Leave a contact null to hide its action.
 * Set `whatsapp` only with a confirmed WhatsApp Business number.
 */
const pin = { lat: 14.1047859, lng: 120.8365088 };

export const contacts = {
  facebook: 'https://www.facebook.com/arqapalmvillas',
  instagram: 'https://www.instagram.com/arqapalmvillas/',
  email: 'arqapalmvillarental@gmail.com' as string | null,
  phone: { display: '+63 966 327 0377', tel: '+639663270377' } as { display: string; tel: string } | null,
  whatsapp: null as string | null,
};

export const map = {
  place:
    'https://www.google.com/maps/place/Arqa+Palm+Villas/@14.1047859,120.8339339,804m/data=!3m2!1e3!4b1!4m9!3m8!1s0x33bd9d007a4b8d83:0xa759d38defc47ac2!5m2!4m1!1i2!8m2!3d14.1047859!4d120.8365088!16s%2Fg%2F11ntjwmnb8',
  directions: `https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`,
  embed: `https://maps.google.com/maps?q=${pin.lat},${pin.lng}+(ARQA%20Palm%20Villas)&z=16&output=embed`,
};

export const credit = {
  label: 'Lendez Studio',
  href: 'https://lendezstudio.com/',
};
