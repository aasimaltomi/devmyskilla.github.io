const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const DesignRuntime = require('../js/design-runtime.js');

const DEFAULT_DESIGN = {
  version: 1,
  theme: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    background: '#f7f8fc',
    surface: '#ffffff',
    text: '#15162a',
    mutedText: '#6b7087',
    border: '#e4e6f0',
  },
  typography: {
    baseSize: 16,
    headingScale: 1.25,
    bodyWeight: 400,
    headingWeight: 800,
  },
  shape: {
    cardRadius: 22,
    buttonRadius: 14,
    borderWidth: 1,
  },
  spacing: {
    sectionGap: 84,
    cardGap: 16,
    contentMaxWidth: 1240,
  },
  layout: {
    textAlign: 'start',
    sectionOrder: [
      'landingHero',
      'courseCategories',
      'problemSection',
      'aboutProject',
      'whySection',
      'howItWorks',
      'landingStats',
      'developerSection',
      'landingCta',
    ],
    hiddenSections: [],
  },
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function fakeRoot() {
  const values = new Map();
  return {
    dataset: {},
    style: {
      setProperty(name, value) {
        values.set(name, value);
      },
      getPropertyValue(name) {
        return values.get(name) || '';
      },
    },
  };
}

test('validateDesign accepts the whitelisted design contract', () => {
  assert.deepEqual(DesignRuntime.validateDesign(DEFAULT_DESIGN), DEFAULT_DESIGN);
});

test('validateDesign rejects unsafe or malformed settings', () => {
  const badColor = clone(DEFAULT_DESIGN);
  badColor.theme.primary = 'red';
  assert.throws(() => DesignRuntime.validateDesign(badColor), /primary/);

  const badSize = clone(DEFAULT_DESIGN);
  badSize.spacing.contentMaxWidth = 5000;
  assert.throws(() => DesignRuntime.validateDesign(badSize), /contentMaxWidth/);

  const unknownSection = clone(DEFAULT_DESIGN);
  unknownSection.layout.hiddenSections = ['site-header'];
  assert.throws(() => DesignRuntime.validateDesign(unknownSection), /section/);

  const arbitraryKey = { ...clone(DEFAULT_DESIGN), rawCss: 'body{display:none}' };
  assert.throws(() => DesignRuntime.validateDesign(arbitraryKey), /key/);
});

test('applyTheme changes only approved design CSS variables', () => {
  const root = fakeRoot();
  DesignRuntime.applyTheme(DEFAULT_DESIGN, root);

  assert.equal(root.style.getPropertyValue('--design-primary'), '#4f46e5');
  assert.equal(root.style.getPropertyValue('--design-secondary'), '#7c3aed');
  assert.equal(root.style.getPropertyValue('--design-background'), '#f7f8fc');
  assert.equal(root.style.getPropertyValue('--design-surface'), '#ffffff');
  assert.equal(root.style.getPropertyValue('--design-text'), '#15162a');
  assert.equal(root.style.getPropertyValue('--design-muted-text'), '#6b7087');
  assert.equal(root.style.getPropertyValue('--design-border'), '#e4e6f0');
  assert.equal(root.style.getPropertyValue('--design-card-radius'), '22px');
  assert.equal(root.style.getPropertyValue('--design-button-radius'), '14px');
  assert.equal(root.style.getPropertyValue('--design-content-max-width'), '1240px');
  assert.equal(root.style.getPropertyValue('--design-base-font-size'), '16px');
  assert.equal(root.style.getPropertyValue('--design-heading-multiplier'), '1');
  assert.equal(root.dataset.designAlign, 'start');
  assert.equal(root.dataset.designApplied, 'true');
});

test('applyHomepageLayout can hide and reorder only registered homepage sections', () => {
  const order = [];
  const main = {
    appendChild(element) {
      order.push(element.id);
      element.parentElement = main;
    },
  };
  const elements = Object.fromEntries(
    DEFAULT_DESIGN.layout.sectionOrder.map((id) => [
      id,
      { id, hidden: false, parentElement: main, dataset: { designSection: id } },
    ]),
  );
  const documentRef = {
    querySelector(selector) {
      return selector === '.landing-main' ? main : null;
    },
    getElementById(id) {
      return elements[id] || null;
    },
  };

  const design = clone(DEFAULT_DESIGN);
  design.layout.hiddenSections = ['problemSection'];
  design.layout.sectionOrder = [
    'courseCategories',
    'landingHero',
    ...DEFAULT_DESIGN.layout.sectionOrder.slice(2),
  ];

  DesignRuntime.applyHomepageLayout(design, documentRef);

  assert.equal(elements.problemSection.hidden, true);
  assert.equal(elements.landingHero.hidden, false);
  assert.deepEqual(order.slice(0, 2), ['courseCategories', 'landingHero']);
});

test('loadAndApplyDesign defers homepage layout until DOMContentLoaded when booted in head', async () => {
  const root = fakeRoot();
  const order = [];
  let onReady = null;
  const main = {
    appendChild(element) {
      order.push(element.id);
      element.parentElement = main;
    },
  };
  const elements = Object.fromEntries(
    DEFAULT_DESIGN.layout.sectionOrder.map((id) => [
      id,
      { id, hidden: false, parentElement: main, dataset: { designSection: id } },
    ]),
  );
  const documentRef = {
    readyState: 'loading',
    addEventListener(name, callback) {
      if (name === 'DOMContentLoaded') onReady = callback;
    },
    querySelector(selector) {
      return selector === '.landing-main' ? main : null;
    },
    getElementById(id) {
      return elements[id] || null;
    },
  };

  const design = clone(DEFAULT_DESIGN);
  design.layout.sectionOrder = [
    'courseCategories',
    'landingHero',
    ...DEFAULT_DESIGN.layout.sectionOrder.slice(2),
  ];

  await DesignRuntime.loadAndApplyDesign({
    fetchFn: async () => ({ ok: true, json: async () => design }),
    root,
    documentRef,
  });

  assert.deepEqual(order, []);
  assert.equal(typeof onReady, 'function');
  onReady();
  assert.deepEqual(order.slice(0, 2), ['courseCategories', 'landingHero']);
});

test('loadAndApplyDesign leaves compiled CSS untouched when design fetch fails', async () => {
  const root = fakeRoot();
  const result = await DesignRuntime.loadAndApplyDesign({
    fetchFn: async () => ({ ok: false, status: 404 }),
    root,
    documentRef: null,
  });

  assert.equal(result, null);
  assert.equal(root.style.getPropertyValue('--design-primary'), '');
});

test('homepage markup registers the exact safe section allowlist and loads design runtime', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  for (const id of DEFAULT_DESIGN.layout.sectionOrder) {
    assert.match(html, new RegExp(`id=["']${id}["'][^>]*data-design-section=["']${id}["']|data-design-section=["']${id}["'][^>]*id=["']${id}["']`));
  }
  assert.match(html, /<script[^>]+src=["']js\/design-runtime\.js["']/);
});
