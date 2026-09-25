'use strict';
// Safety Eyewear Style Picker data.
//
// These are STYLE CATEGORIES, not products. Do not add prices, certification
// badges or model names here unless they come from a signed supplier with
// product documentation. When a supplier catalogue exists, add real frames to a
// style's `frames` array and they will render under that style automatically:
//   frames: [{ manufacturer: 'Maker', model: 'Model', standard: 'CSA Z94.3 marking as printed on the frame', note: '' }]

const FRAME = 'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';

const styles = [
  {
    id: 'full-frame-side-shields',
    name: 'Full-frame with side shields',
    summary: 'A conventional prescription frame with integrated or attached side protection.',
    bestFor: 'General industrial, workshop and maintenance tasks where particles can come from the side.',
    consider: 'Side shields must stay fitted. Suits most single-vision and multifocal prescriptions.',
    svg: `<rect x="30" y="38" width="76" height="50" rx="12"/><rect x="134" y="38" width="76" height="50" rx="12"/><path d="M106 54c6-7 22-7 28 0"/><path d="M30 46l-18 5v28l18 5"/><path d="M210 46l18 5v28l-18 5"/>`,
    frames: [],
  },
  {
    id: 'wraparound',
    name: 'Wraparound',
    summary: 'A curved front that follows the face for wider coverage.',
    bestFor: 'Outdoor, windy and dusty sites where peripheral coverage matters.',
    consider: 'Strong curvature can limit higher prescriptions. An eye-care professional confirms suitability.',
    svg: `<path d="M18 52c22-16 62-18 94-10 4 18 2 34-6 46-30 6-62 4-80-6-6-10-9-20-8-30z"/><path d="M222 52c-22-16-62-18-94-10-4 18-2 34 6 46 30 6 62 4 80-6 6-10 9-20 8-30z"/><path d="M112 45c5-4 11-4 16 0"/>`,
    frames: [],
  },
  {
    id: 'sealed-gasket',
    name: 'Sealed or gasket frames',
    summary: 'Frames with a foam or removable seal that closes the gap around the eyes.',
    bestFor: 'Fine dust, wind and frequent moves between heated buildings and cold yards.',
    consider: 'Pair with anti-fog lenses. Check comfort with hard hats and respirators.',
    svg: `<rect x="32" y="40" width="72" height="46" rx="12"/><rect x="136" y="40" width="72" height="46" rx="12"/><rect x="22" y="30" width="92" height="66" rx="20" stroke-dasharray="5 5"/><rect x="126" y="30" width="92" height="66" rx="20" stroke-dasharray="5 5"/><path d="M114 56c4-4 8-4 12 0"/>`,
    frames: [],
  },
  {
    id: 'multifocal',
    name: 'Multifocal-capable',
    summary: 'A deeper frame that accommodates bifocal or progressive lenses.',
    bestFor: 'Workers who need clear distance and close-up vision, such as reading gauges, labels and paperwork.',
    consider: 'Lens height must suit the multifocal design. Fitting measurements matter.',
    svg: `<rect x="30" y="32" width="76" height="60" rx="12"/><rect x="134" y="32" width="76" height="60" rx="12"/><path d="M106 50c6-7 22-7 28 0"/><path d="M46 74c9-6 35-6 44 0"/><path d="M150 74c9-6 35-6 44 0"/>`,
    frames: [],
  },
  {
    id: 'non-metal',
    name: 'Non-metal frames',
    summary: 'Frames built without exposed metal components.',
    bestFor: 'Electrical and energized-equipment work where the hazard assessment calls for non-conductive eyewear.',
    consider: 'Confirm requirements with your electrical safety program before selecting.',
    svg: `<rect x="30" y="38" width="76" height="50" rx="14" stroke-width="7"/><rect x="134" y="38" width="76" height="50" rx="14" stroke-width="7"/><path d="M106 54c6-7 22-7 28 0" stroke-width="7"/>`,
    frames: [],
  },
  {
    id: 'task-computer',
    name: 'Task and computer eyewear',
    summary: 'Prescription eyewear set for a specific working distance, such as a screen.',
    bestFor: 'Screen-intensive and office roles. This style is not safety-rated.',
    consider: 'Not a substitute for safety eyewear where eye hazards exist.',
    notSafety: true,
    svg: `<rect x="32" y="42" width="72" height="40" rx="6" stroke-width="2.5"/><rect x="136" y="42" width="72" height="40" rx="6" stroke-width="2.5"/><path d="M104 56c6-6 26-6 32 0" stroke-width="2.5"/><rect x="104" y="92" width="32" height="18" rx="2" stroke-width="2"/>`,
    frames: [],
  },
];

const lensFeatures = [
  { id: 'lens-anti-fog', name: 'Anti-fog coating', note: 'For temperature changes, humidity and exertion.' },
  { id: 'lens-scratch', name: 'Scratch-resistant coating', note: 'For dusty and abrasive environments.' },
  { id: 'lens-anti-reflective', name: 'Anti-reflective coating', note: 'Reduces reflections from lights and screens.' },
  { id: 'lens-photochromic', name: 'Light-adaptive (photochromic)', note: 'Can be slow to clear indoors and may not darken behind a windshield.' },
  { id: 'lens-polarized', name: 'Polarized', note: 'Cuts outdoor glare, but can make some digital displays hard to read.' },
  { id: 'lens-tint', name: 'Outdoor tint', note: 'For bright outdoor work. Not suitable for low-light tasks.' },
];

module.exports = { styles, lensFeatures, FRAME };
