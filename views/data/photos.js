'use strict';
// Photography registry. All images are from Unsplash (free licence: https://unsplash.com/license)
// and are served from Unsplash's image CDN, sized per request. They are illustrative stock
// photography: the people and places shown are not VPI staff, clients or sites.
// `slug` is the photo page: https://unsplash.com/photos/<slug>

const photos = {
  'worker-glasses':  { id: 'photo-1754747197440-0bbf8a0ac1a9', slug: 'IfYUFOR7IsA', credit: 'mahdi chaghari', alt: 'Worker adjusting clear safety glasses in a workshop' },
  'goggles-earmuffs':{ id: 'photo-1643704169438-efd6d5707214', slug: '8WmS1_XWdKg', credit: 'Jimmy Nilsson Masth', alt: 'Worker wearing safety goggles and hearing protection' },
  'clear-safety':    { id: 'photo-1694892461947-ae4c8473831b', slug: 'G3Cam-zjN5Q', credit: 'Redowan Dhrubo', alt: 'Clear protective glasses resting on a grey surface' },
  'optical-display': { id: 'photo-1788347101988-bf40abcbb2c7', slug: 'xGsOQcGFA9g', credit: 'Sabhyata Sahu', alt: 'Rows of eyeglass frames on illuminated shelves' },
  'screen-work':     { id: 'photo-1758874383464-f6d432209862', slug: 'XVmbJNSfO5I', credit: 'Vitaly Gariev', alt: 'Man wearing glasses working at a laptop' },
  'eye-chart':       { id: 'photo-1758206524001-56b1b1ec72cf', slug: 'QSqphOrPako', credit: 'Navy Medicine', alt: 'Eye-care professional pointing to an eye chart' },
  'highway':         { id: 'photo-1603485099313-1ce42aff2319', slug: 'M-Y8vnw-d1w', credit: 'Miles Loewen', alt: 'Highway through forest under a blue sky' },
  'analytics':       { id: 'photo-1551288049-bebda4e38f71', slug: 'JKUTrJ4vK00', credit: 'Luke Chesser', alt: 'Analytics dashboard on a laptop screen' },
  'site-review':     { id: 'photo-1737874960921-d1205a4f55da', slug: 'JjG6_-Fhkd4', credit: 'Ana Lucia Videira', alt: 'Two workers in hard hats and high-visibility vests reviewing a document in an industrial workshop' },
  'eye-exam':        { id: 'photo-1766310549795-dd0fc75d499f', slug: '3r0Mv2Muvyk', credit: 'Annie Spratt', alt: 'Optometrist examining a patient with a slit lamp' },
  'control-room':    { id: 'photo-1639313521811-fdfb1c040ddb', slug: 'p7Bfwn_VKRQ', credit: 'Miha Meglic', alt: 'Operations control room with a wall of screens' },
  'plant-engineer':  { id: 'photo-1581092162572-fe1cb11cd26e', slug: 'KQXrDYrfvnw', credit: 'ThisisEngineering', alt: 'Engineer wearing clear safety glasses, concentrating on work in an industrial facility' },
  'energy-worker':   { id: 'photo-1613620844865-ffb87d753609', slug: 'wWqEavY9rZM', credit: 'Call me LAMB', alt: 'Worker in a hard hat handling pipework at an industrial facility' },
  'lineworkers':     { id: 'photo-1759542877886-39d81e8f2eee', slug: 'UyqxlMS8X84', credit: 'Mario Spencer', alt: 'Line workers repairing a utility pole from a bucket truck' },
  'construction':    { id: 'photo-1587582423116-ec07293f0395', slug: 'X1P1_EDNnok', credit: 'Josh Olalde', alt: 'Construction worker in a hard hat on a building frame' },
  'construction-crew': { id: 'photo-1775880303572-791fbbb73d32', slug: '9j0HxsTPBlk', credit: 'Adhitya Sibikumar', alt: 'Construction workers in hard hats beside a building under construction' },
  'grinding':        { id: 'photo-1778582384724-d6ce1dfe6df1', slug: 'JvmFL2FEE8Q', credit: 'Ricardo IV Tamayo', alt: 'Metal grinding with sparks flying in a dark workshop' },
  'warehouse':       { id: 'photo-1689942010216-dc412bb1e7a9', slug: 'OnbSOhz0oig', credit: 'AFINIS Group', alt: 'Warehouse aisles stacked with pallets' },
  'truck':           { id: 'photo-1711542377802-d4577765c68b', slug: 'vQijG3uuaNw', credit: 'Bernd Dittrich', alt: 'Blue semi-truck driving on a rural road' },
  'office':          { id: 'photo-1560264357-8d9202250f21', slug: 'nFLmPAf9dVc', credit: 'Arlington Research', alt: 'People working at computer screens in an office' },
  'mining':          { id: 'photo-1622645636770-11fbf0611463', slug: 'Evss0Whf5OI', credit: 'omid roshan', alt: 'Haul truck on a dusty mine road' },
  'healthcare':      { id: 'photo-1588683023217-97e48b7da1a2', slug: 'n37MJK1dswA', credit: 'Maxim Tolchinskiy', alt: 'Healthcare worker in scrubs wearing protective eyewear' },
  'city':            { id: 'photo-1709014488957-bd321385b8a1', slug: 'XfpSr1OBtio', credit: 'Redd Francisco', alt: 'City skyline beyond a river bridge' },
  'river-valley':    { id: 'photo-1655056028228-adbfb810a6a1', slug: 'ABhcSHBdgSA', credit: 'Amber Ford', alt: 'Bridge over a river valley with a city skyline behind' },
  'glasses-book':    { id: 'photo-1574258495973-f010dfbb5371', slug: 'd05w6_7FaPM', credit: 'Sincerely Media', alt: 'Clear eyeglasses resting on an open book' },
  'meeting':         { id: 'photo-1622675363311-3e1904dc1885', slug: 'ZT5v0puBjZI', credit: 'Mapbox', alt: 'Team meeting around a table with laptops' },
  'wraparound':      { id: 'photo-1749527306079-ebb2565d7706', slug: 'Lzv09VjO6SA', credit: 'Rebika Maharjan', alt: 'Wraparound glasses with a curved lens on a white background' },
  'lab-goggles':     { id: 'photo-1707944745860-4615eb585a41', slug: 'm-7R-AgsvbI', credit: 'National Institute of Allergy and Infectious Diseases', alt: 'Person in a laboratory wearing sealed safety goggles' },
  'glasses-chart':   { id: 'photo-1517948430535-1e2469d314fe', slug: 'aVvZJC0ynBQ', credit: 'David Travis', alt: 'Hand holding eyeglasses in front of an eye chart' },
  'plastic-frames':  { id: 'photo-1483412468200-72182dbbc544', slug: '0R1ci4Rb9jU', credit: 'blocks', alt: 'Black plastic eyeglass frames' },
  'glasses-laptop':  { id: 'photo-1639789973476-de7536905d06', slug: 'ThxNz6a7Wfw', credit: 'Nubelson Fernandes', alt: 'Eyeglasses resting on a laptop keyboard' },
};

const BASE = 'https://images.unsplash.com/';
function url(key, w, h) {
  const p = photos[key];
  if (!p) throw new Error(`Unknown photo "${key}"`);
  return `${BASE}${p.id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=70`;
}

module.exports = { photos, url };
