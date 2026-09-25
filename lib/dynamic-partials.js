'use strict';
// Data-driven partials. Each returns server-rendered HTML.
const { styles, lensFeatures, FRAME } = require('../views/data/eyewear-styles');

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function frameList(frames) {
  if (!frames.length) return '';
  const items = frames.map(f =>
    `<li><strong>${esc(f.manufacturer)} ${esc(f.model)}</strong>${f.standard ? ` · ${esc(f.standard)}` : ''}${f.note ? ` · ${esc(f.note)}` : ''}</li>`).join('');
  return `<div class="style-card__frames"><h4>Available frames</h4><ul>${items}</ul></div>`;
}

module.exports = {
  status({ kind }) {
    const labels = { available: 'Available now', development: 'In development', planned: 'Planned', internal: 'Internal platform' };
    if (!labels[kind]) throw new Error(`Unknown status kind "${kind}"`);
    return `<span class="status status--${kind}"><span class="status__dot" aria-hidden="true"></span>${labels[kind]}</span>`;
  },

  'eyewear-style-grid'() {
    const cards = styles.map(s => `
      <li class="style-card" id="${esc(s.id)}">
        <figure class="style-card__art" aria-hidden="true"><svg viewBox="0 0 240 120" ${FRAME}>${s.svg}</svg></figure>
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
          <span class="lens-option__box" aria-hidden="true"><svg><use href="#i-check"/></svg></span>
          <span><strong>${esc(l.name)}</strong><span class="lens-option__note">${esc(l.note)}</span></span>
        </button>
      </li>`).join('');
    return `<ul class="lens-options" role="list">${items}</ul>`;
  },
};
