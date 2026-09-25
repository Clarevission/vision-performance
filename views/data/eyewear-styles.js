'use strict';
// Safety Eyewear Style Picker data.
//
// These are STYLE CATEGORIES, not products. Each `photo` (a key in views/data/photos.js)
// is a representative stock photo of the general style, not a specific product.
// Do not add prices, certification badges or model names here unless they come from a
// signed supplier with product documentation. When a supplier catalogue exists, add real
// frames to a style's `frames` array and they will render under that style automatically:
//   frames: [{ manufacturer: 'Maker', model: 'Model', standard: 'CSA Z94.3 marking as printed on the frame', note: '' }]

const styles = [
  {
    id: 'full-frame-side-shields',
    photo: 'clear-safety',
    name: 'Full-frame with side shields',
    summary: 'A conventional prescription frame with integrated or attached side protection.',
    bestFor: 'General industrial, workshop and maintenance tasks where particles can come from the side.',
    consider: 'Side shields must stay fitted. Suits most single-vision and multifocal prescriptions.',
    frames: [],
  },
  {
    id: 'wraparound',
    photo: 'wraparound',
    name: 'Wraparound',
    summary: 'A curved front that follows the face for wider coverage.',
    bestFor: 'Outdoor, windy and dusty sites where peripheral coverage matters.',
    consider: 'Strong curvature can limit higher prescriptions. An eye-care professional confirms suitability.',
    frames: [],
  },
  {
    id: 'sealed-gasket',
    photo: 'lab-goggles',
    name: 'Sealed or gasket frames',
    summary: 'Frames with a foam or removable seal that closes the gap around the eyes.',
    bestFor: 'Fine dust, wind and frequent moves between heated buildings and cold yards.',
    consider: 'Pair with anti-fog lenses. Check comfort with hard hats and respirators.',
    frames: [],
  },
  {
    id: 'multifocal',
    photo: 'glasses-chart',
    name: 'Multifocal-capable',
    summary: 'A deeper frame that accommodates bifocal or progressive lenses.',
    bestFor: 'Workers who need clear distance and close-up vision, such as reading gauges, labels and paperwork.',
    consider: 'Lens height must suit the multifocal design. Fitting measurements matter.',
    frames: [],
  },
  {
    id: 'non-metal',
    photo: 'plastic-frames',
    name: 'Non-metal frames',
    summary: 'Frames built without exposed metal components.',
    bestFor: 'Electrical and energized-equipment work where the hazard assessment calls for non-conductive eyewear.',
    consider: 'Confirm requirements with your electrical safety program before selecting.',
    frames: [],
  },
  {
    id: 'task-computer',
    photo: 'glasses-laptop',
    name: 'Task and computer eyewear',
    summary: 'Prescription eyewear set for a specific working distance, such as a screen.',
    bestFor: 'Screen-intensive and office roles. This style is not safety-rated.',
    consider: 'Not a substitute for safety eyewear where eye hazards exist.',
    notSafety: true,
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

module.exports = { styles, lensFeatures };
