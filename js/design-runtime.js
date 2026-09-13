(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.DunyaDesignRuntime = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const SECTION_IDS = Object.freeze([
    'landingHero',
    'courseCategories',
    'problemSection',
    'aboutProject',
    'whySection',
    'howItWorks',
    'landingStats',
    'developerSection',
    'landingCta',
  ]);

  const TOP_LEVEL_KEYS = ['version', 'theme', 'typography', 'shape', 'spacing', 'layout'];
  const THEME_KEYS = ['primary', 'secondary', 'background', 'surface', 'text', 'mutedText', 'border'];
  const TYPOGRAPHY_KEYS = ['baseSize', 'headingScale', 'bodyWeight', 'headingWeight'];
  const SHAPE_KEYS = ['cardRadius', 'buttonRadius', 'borderWidth'];
  const SPACING_KEYS = ['sectionGap', 'cardGap', 'contentMaxWidth'];
  const LAYOUT_KEYS = ['textAlign', 'sectionOrder', 'hiddenSections'];
  const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

  function fail(message) {
    throw new Error(`Invalid design: ${message}`);
  }

  function plainObject(value, name) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${name} must be an object`);
    return value;
  }

  function exactKeys(value, expected, name) {
    const keys = Object.keys(value);
    const unknown = keys.filter((key) => !expected.includes(key));
    const missing = expected.filter((key) => !keys.includes(key));
    if (unknown.length) fail(`${name} has unknown key ${unknown[0]}`);
    if (missing.length) fail(`${name} is missing key ${missing[0]}`);
  }

  function numberInRange(value, min, max, name, integer) {
    if (typeof value !== 'number' || !Number.isFinite(value)) fail(`${name} must be a number`);
    if (integer && !Number.isInteger(value)) fail(`${name} must be an integer`);
    if (value < min || value > max) fail(`${name} is out of range`);
    return value;
  }

  function oneOf(value, allowed, name) {
    if (!allowed.includes(value)) fail(`${name} is unsupported`);
    return value;
  }

  function validateSections(value, name, requireComplete) {
    if (!Array.isArray(value)) fail(`${name} must be an array`);
    if (new Set(value).size !== value.length) fail(`${name} contains duplicate section ids`);
    for (const id of value) {
      if (!SECTION_IDS.includes(id)) fail(`${name} contains unknown section ${String(id)}`);
    }
    if (requireComplete) {
      if (value.length !== SECTION_IDS.length) fail(`${name} must contain every supported section`);
      for (const id of SECTION_IDS) {
        if (!value.includes(id)) fail(`${name} is missing section ${id}`);
      }
    }
    return value.slice();
  }

  function validateDesign(input) {
    const design = plainObject(input, 'root');
    exactKeys(design, TOP_LEVEL_KEYS, 'root');
    if (design.version !== 1) fail('version must be 1');

    const theme = plainObject(design.theme, 'theme');
    exactKeys(theme, THEME_KEYS, 'theme');
    for (const key of THEME_KEYS) {
      if (typeof theme[key] !== 'string' || !HEX_COLOR.test(theme[key])) fail(`${key} must be a six-digit hex color`);
    }

    const typography = plainObject(design.typography, 'typography');
    exactKeys(typography, TYPOGRAPHY_KEYS, 'typography');
    numberInRange(typography.baseSize, 12, 22, 'baseSize', true);
    numberInRange(typography.headingScale, 1, 1.6, 'headingScale', false);
    oneOf(typography.bodyWeight, [400, 500, 600], 'bodyWeight');
    oneOf(typography.headingWeight, [600, 700, 800], 'headingWeight');

    const shape = plainObject(design.shape, 'shape');
    exactKeys(shape, SHAPE_KEYS, 'shape');
    numberInRange(shape.cardRadius, 0, 40, 'cardRadius', true);
    numberInRange(shape.buttonRadius, 0, 32, 'buttonRadius', true);
    numberInRange(shape.borderWidth, 0, 4, 'borderWidth', true);

    const spacing = plainObject(design.spacing, 'spacing');
    exactKeys(spacing, SPACING_KEYS, 'spacing');
    numberInRange(spacing.sectionGap, 24, 120, 'sectionGap', true);
    numberInRange(spacing.cardGap, 8, 48, 'cardGap', true);
    numberInRange(spacing.contentMaxWidth, 900, 1600, 'contentMaxWidth', true);

    const layout = plainObject(design.layout, 'layout');
    exactKeys(layout, LAYOUT_KEYS, 'layout');
    oneOf(layout.textAlign, ['start', 'center', 'end'], 'textAlign');
    const sectionOrder = validateSections(layout.sectionOrder, 'sectionOrder', true);
    const hiddenSections = validateSections(layout.hiddenSections, 'hiddenSections', false);

    return {
      version: 1,
      theme: Object.fromEntries(THEME_KEYS.map((key) => [key, theme[key]])),
      typography: {
        baseSize: typography.baseSize,
        headingScale: typography.headingScale,
        bodyWeight: typography.bodyWeight,
        headingWeight: typography.headingWeight,
      },
      shape: {
        cardRadius: shape.cardRadius,
        buttonRadius: shape.buttonRadius,
        borderWidth: shape.borderWidth,
      },
      spacing: {
        sectionGap: spacing.sectionGap,
        cardGap: spacing.cardGap,
        contentMaxWidth: spacing.contentMaxWidth,
      },
      layout: {
        textAlign: layout.textAlign,
        sectionOrder,
        hiddenSections,
      },
    };
  }

  function applyTheme(input, rootElement) {
    const design = validateDesign(input);
    const target = rootElement || (typeof document !== 'undefined' ? document.documentElement : null);
    if (!target || !target.style || typeof target.style.setProperty !== 'function') return design;

    const variables = {
      '--design-primary': design.theme.primary,
      '--design-secondary': design.theme.secondary,
      '--design-background': design.theme.background,
      '--design-surface': design.theme.surface,
      '--design-text': design.theme.text,
      '--design-muted-text': design.theme.mutedText,
      '--design-border': design.theme.border,
      '--design-base-font-size': `${design.typography.baseSize}px`,
      '--design-heading-scale': String(design.typography.headingScale),
      '--design-body-weight': String(design.typography.bodyWeight),
      '--design-heading-weight': String(design.typography.headingWeight),
      '--design-card-radius': `${design.shape.cardRadius}px`,
      '--design-button-radius': `${design.shape.buttonRadius}px`,
      '--design-border-width': `${design.shape.borderWidth}px`,
      '--design-section-gap': `${design.spacing.sectionGap}px`,
      '--design-card-gap': `${design.spacing.cardGap}px`,
      '--design-content-max-width': `${design.spacing.contentMaxWidth}px`,
      '--design-hero-heading-size': `${Math.round(design.typography.baseSize * design.typography.headingScale * 2.65)}px`,
      '--design-section-heading-size': `${Math.round(design.typography.baseSize * design.typography.headingScale * 1.8)}px`,
    };

    for (const [name, value] of Object.entries(variables)) target.style.setProperty(name, value);
    if (target.dataset) target.dataset.designAlign = design.layout.textAlign;
    return design;
  }

  function applyHomepageLayout(input, documentRef) {
    const design = validateDesign(input);
    const doc = documentRef || (typeof document !== 'undefined' ? document : null);
    if (!doc || typeof doc.getElementById !== 'function') return design;

    const main = typeof doc.querySelector === 'function' ? doc.querySelector('.landing-main') : null;
    const hidden = new Set(design.layout.hiddenSections);

    for (const id of SECTION_IDS) {
      const element = doc.getElementById(id);
      if (!element || !element.dataset || element.dataset.designSection !== id) continue;
      element.hidden = hidden.has(id);
    }

    if (main && typeof main.appendChild === 'function') {
      for (const id of design.layout.sectionOrder) {
        const element = doc.getElementById(id);
        if (!element || !element.dataset || element.dataset.designSection !== id) continue;
        if (element.parentElement === main) main.appendChild(element);
      }
    }

    return design;
  }

  async function loadAndApplyDesign(options) {
    const settings = options || {};
    const fetchFn = settings.fetchFn || (typeof fetch === 'function' ? fetch.bind(globalThis) : null);
    const targetRoot = settings.root || (typeof document !== 'undefined' ? document.documentElement : null);
    const documentRef = settings.documentRef === undefined ? (typeof document !== 'undefined' ? document : null) : settings.documentRef;
    if (!fetchFn) return null;

    try {
      const response = await fetchFn('design.json', { cache: 'no-store' });
      if (!response || !response.ok) return null;
      const design = validateDesign(await response.json());
      applyTheme(design, targetRoot);
      applyHomepageLayout(design, documentRef);
      return design;
    } catch (_error) {
      return null;
    }
  }

  const api = Object.freeze({
    SECTION_IDS,
    validateDesign,
    applyTheme,
    applyHomepageLayout,
    loadAndApplyDesign,
  });

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    window.DunyaDesignReady = loadAndApplyDesign();
  }

  return api;
});
