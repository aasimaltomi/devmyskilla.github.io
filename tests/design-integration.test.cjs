const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const PAGES = ['index.html', 'explore.html', 'platform.html'];

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

test('design.json matches the compiled public defaults', () => {
  const design = JSON.parse(fs.readFileSync(path.join(ROOT, 'design.json'), 'utf8'));
  assert.deepEqual(design, DEFAULT_DESIGN);
});

test('shared design stylesheet maps only safe design variables with fallbacks', () => {
  const css = fs.readFileSync(path.join(ROOT, 'css', 'design-runtime.css'), 'utf8');

  for (const variable of [
    '--design-primary',
    '--design-secondary',
    '--design-background',
    '--design-surface',
    '--design-text',
    '--design-muted-text',
    '--design-border',
    '--design-base-font-size',
    '--design-heading-scale',
    '--design-body-weight',
    '--design-heading-weight',
    '--design-card-radius',
    '--design-button-radius',
    '--design-border-width',
    '--design-section-gap',
    '--design-card-gap',
    '--design-content-max-width',
  ]) {
    assert.match(css, new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.doesNotMatch(css, /url\s*\(|@import|expression\s*\(|javascript:/i);
  assert.match(css, /\[data-design-align="center"\]/);
  assert.match(css, /\[data-design-align="end"\]/);
});

test('all public page shells load the safe design stylesheet and runtime before site runtime', () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const designCss = html.indexOf('css/design-runtime.css');
    const designJs = html.indexOf('js/design-runtime.js');
    const siteRuntime = html.indexOf('js/site-runtime.js');

    assert.ok(designCss >= 0, `${page} must load css/design-runtime.css`);
    assert.ok(designJs >= 0, `${page} must load js/design-runtime.js`);
    assert.ok(siteRuntime >= 0, `${page} must load js/site-runtime.js`);
    assert.ok(designJs < siteRuntime, `${page} must load design runtime before site runtime`);
  }
});
