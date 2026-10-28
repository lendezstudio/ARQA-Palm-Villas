/**
 * Public copy, taken from 03_Website_Copy. Internal notes and unconfirmed
 * facts (rates, capacities, times, address, travel times) are deliberately absent.
 */
export const nav = [
  { label: 'Our Villas', href: '#villas' },
  { label: 'Spaces at ARQA', href: '#spaces' },
  { label: 'Plan Your Stay', href: '#plan' },
  { label: 'Location', href: '#location' },
] as const;

export const actions = {
  primary: 'Check Availability',
  explore: 'Explore the Villas',
  gallery: 'View Gallery',
  walkthrough: 'Watch the Walkthrough',
  withSound: 'Watch with Sound',
  closeMenu: 'Close Menu',
  closeViewer: 'Close Viewer',
};

export const intro = {
  eyebrow: 'ARQA Palm Villas · Alfonso, Cavite',
  heading: ['Room to slow down.', 'Space to be together.'],
  body: 'Settle into warm interiors, step out beside the pool, and leave a little room in the day for doing less. ARQA Palm Villas brings private villa stays to Alfonso, with spaces for quiet moments and time shared.',
};

/** Names from public listings, pending owner confirmation. No invented differences. */
export const villas = {
  eyebrow: 'Our Villas',
  heading: 'Find the setting for your stay.',
  body: 'Start with a villa in mind, or tell us about your group and let the team help you explore the options.',
  names: ['Kaia Suite', 'Villa Raia', 'Balai Mohan'] as const,
  shared: 'Ask the ARQA team about the layout, guest arrangements, inclusions and availability for your preferred dates.',
  action: 'Ask About This Villa',
};

export const timeAtArqa = {
  eyebrow: 'Time at ARQA',
  heading: 'A slower kind of day.',
  body: 'A pause by the water. A conversation around the table. Light moving across timber and stone. Sometimes the best part of getting away is having the time to notice it.',
  action: 'Explore the Spaces',
  slides: [
    { title: 'By the pool', text: 'Make room for an unhurried afternoon.', photo: 'circular-window-over-pool' },
    { title: 'Around the table', text: 'Leave time for one more story.', photo: 'covered-dining-pool' },
    { title: 'In the details', text: 'Warm textures and distinctive lines, seen a little closer.', photo: 'circular-window-view' },
  ],
};

export const spaces = {
  eyebrow: 'Spaces at ARQA',
  heading: 'Take a closer look.',
  body: 'Explore the architecture, interiors and poolside spaces before you plan your stay.',
  filters: [
    { key: 'all', label: 'All Spaces' },
    { key: 'interior', label: 'Interiors' },
    { key: 'poolside', label: 'Poolside' },
    { key: 'detail', label: 'Details' },
    { key: 'video', label: 'Video' },
  ] as const,
  openPhoto: 'Open Photo',
};

export const plan = {
  eyebrow: 'Plan Your Stay',
  heading: 'A few details, and we can take it from there.',
  body: 'Share your preferred dates, group size and the villa you have in mind. The ARQA team can help you check availability and understand the details before you decide.',
  action: 'Start an Inquiry',
  questions: [
    {
      q: 'How do I check availability?',
      a: 'Send your preferred dates, guest count and villa choice to the ARQA team. They can confirm availability and the current rate for your stay.',
    },
    {
      q: 'Which villa should I choose?',
      a: 'Tell the team who is coming and what matters most to your group. Ask for the current room layout, sleeping arrangements and inclusions for each option.',
    },
    {
      q: 'Where is ARQA Palm Villas?',
      a: 'ARQA Palm Villas is in Alfonso, Cavite. Request the confirmed location pin and directions when planning your arrival.',
    },
  ],
};

export const location = {
  eyebrow: 'Alfonso, Cavite',
  heading: 'Your next stay, in Alfonso.',
  body: 'Planning the journey is part of planning the stay. Ask the team for the confirmed location pin and arrival directions when arranging your visit.',
  action: 'Ask for Directions',
  directionsMessage: 'Could you please share the confirmed location pin and arrival directions?',
};

export const invitation = {
  heading: 'Make time for your next stay.',
  body: 'Start with your dates. The ARQA team can help with the rest.',
};

export const inquiry = {
  eyebrow: 'Your stay at ARQA',
  heading: 'Let us know what you have in mind.',
  body: 'Choose your dates and share a little about your group. This helps the ARQA team respond with the details you need.',
  labels: {
    villa: 'Preferred villa',
    checkIn: 'Check-in date',
    checkOut: 'Check-out date',
    adults: 'Adults',
    children: 'Children',
    name: 'Your name',
    contact: 'Email or mobile, optional',
    message: 'Anything you would like us to know?',
  },
  helpChoose: 'Help me choose',
  guestHelper: 'Include everyone staying overnight. Ask the team about day visitors separately.',
  messagePlaceholder: 'Tell us what matters to your group, or ask a question about the stay.',
  submit: 'Prepare Inquiry',
  privacy: 'Your details are used to prepare the message you choose to send. This form does not confirm a reservation.',
  errors: {
    checkIn: 'Please choose a check-in date.',
    checkOut: 'Please choose a check-out date.',
    order: 'Your check-out date must be after check-in.',
    adults: 'Please enter at least one adult.',
    whole: 'Guest counts must be whole numbers.',
  },
  prepared: {
    heading: 'Your inquiry is ready to send.',
    text: "Copy your details, then open ARQA's Facebook page and paste them into a message. Your stay is subject to the team's availability and booking confirmation.",
    copy: 'Copy Inquiry',
    facebook: 'Continue on Facebook',
    edit: 'Edit Details',
    copied: 'Inquiry copied.',
    copyFailed: 'Select and copy the message below.',
    email: 'Open Email Draft',
    emailHelper: 'Your email app will open with these details. Review and send the message there.',
  },
};

export const footer = {
  name: 'ARQA Palm Villas',
  place: 'Alfonso, Cavite, Philippines',
};
