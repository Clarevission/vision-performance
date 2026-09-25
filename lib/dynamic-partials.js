'use strict';
// Data-driven partials. Each returns server-rendered HTML.
const { styles, lensFeatures } = require('../views/data/eyewear-styles');
const { photos, url } = require('../views/data/photos');

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const RATIOS = { '3:2': 2 / 3, '4:3': 3 / 4, '16:9': 9 / 16, '1:1': 1, '5:4': 4 / 5 };

// Responsive <img> for a registered photo. Params: key, ratio, sizes, loading, class.
function photo({ key, ratio = '3:2', sizes = '100vw', loading = 'lazy', class: cls = '' }) {
  const p = photos[key];
  if (!p) throw new Error(`Unknown photo "${key}"`);
  const r = RATIOS[ratio];
  if (!r) throw new Error(`Unknown photo ratio "${ratio}"`);
  const h = w => Math.round(w * r);
  const srcset = [480, 800, 1200, 1600].map(w => `${url(key, w, h(w))} ${w}w`).join(', ');
  return `<img class="photo${cls ? ` ${esc(cls)}` : ''}" src="${url(key, 800, h(800))}" srcset="${srcset}" sizes="${esc(sizes)}" ` +
    `width="800" height="${h(800)}" alt="${esc(p.alt)}" loading="${loading === 'eager' ? 'eager' : 'lazy'}" decoding="async"` +
    `${loading === 'eager' ? ' fetchpriority="high"' : ''}>`;
}

function frameList(frames) {
  if (!frames.length) return '';
  const items = frames.map(f =>
    `<li><strong>${esc(f.manufacturer)} ${esc(f.model)}</strong>${f.standard ? ` · ${esc(f.standard)}` : ''}${f.note ? ` · ${esc(f.note)}` : ''}</li>`).join('');
  return `<div class="style-card__frames"><h4>Available frames</h4><ul>${items}</ul></div>`;
}

module.exports = {
  photo,

  status({ kind }) {
    const labels = { available: 'Available now', development: 'In development', planned: 'Planned', internal: 'Internal platform' };
    if (!labels[kind]) throw new Error(`Unknown status kind "${kind}"`);
    return `<span class="status status--${kind}"><span class="status__dot" aria-hidden="true"></span>${labels[kind]}</span>`;
  },

  'eyewear-style-grid'() {
    const cards = styles.map(s => `
      <li class="style-card" id="${esc(s.id)}">
        <div class="style-card__photo">${photo({ key: s.photo, ratio: '3:2', sizes: '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw' })}</div>
        <div class="style-card__body">
          <h3 class="style-card__title">${esc(s.name)}</h3>
          ${s.notSafety ? '<p class="style-card__flag">Not safety-rated</p>' : ''}
          <p>${esc(s.summary)}</p>
          <dl class="style-card__facts">
            <div><dt>Best for</dt><dd>${esc(s.bestFor)}</dd></div>
            <div><dt>Consider</dt><dd>${esc(s.consider)}</dd></div>
          </dl>
          ${frameList(s.frames)}
          <button type="button" class="btn btn--secondary btn--block shortlist-toggle" aria-pressed="false"
            data-shortlist="${esc(s.id)}" data-label="${esc(s.name)}">
            <span class="shortlist-toggle__add">Add to shortlist</span><span class="shortlist-toggle__added">Added to shortlist</span>
          </button>
        </div>
      </li>`).join('');
    return `<ul class="style-grid" role="list">${cards}</ul>`;
  },

  'eyewear-lens-options'() {
    const items = lensFeatures.map(l => `
      <li class="lens-option">
        <button type="button" class="lens-option__toggle shortlist-toggle" aria-pressed="false"
          data-shortlist="${esc(l.id)}" data-label="${esc(l.name)}">
          <span class="lens-option__box" aria-hidden="true"></span>
          <span><strong>${esc(l.name)}</strong><span class="lens-option__note">${esc(l.note)}</span></span>
        </button>
      </li>`).join('');
    return `<ul class="lens-options" role="list">${items}</ul>`;
  },
};
