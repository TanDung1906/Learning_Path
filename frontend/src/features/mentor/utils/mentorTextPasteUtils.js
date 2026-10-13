const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];
const DEFAULT_FONT_SIZE = 14;

const HEADING_FONT_SIZES = {
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
};

const ALLOWED_TAGS = new Set([
  'p', 'div', 'br', 'ul', 'ol', 'li',
  'span', 'b', 'strong', 'i', 'em', 'u',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
]);

function snapFontSize(px) {
  if (!px || Number.isNaN(px)) return null;
  const rounded = Math.round(px);
  if (FONT_SIZES.includes(rounded)) return rounded;
  return FONT_SIZES.reduce((best, curr) =>
    Math.abs(curr - rounded) < Math.abs(best - rounded) ? curr : best,
  );
}

function parseFontSizePx(style) {
  const match = String(style ?? '').match(/font-size:\s*([\d.]+)\s*(pt|px|em)\b/i);
  if (!match) return null;
  let value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  if (Number.isNaN(value)) return null;
  if (unit === 'pt') value *= 96 / 72;
  if (unit === 'em') value *= DEFAULT_FONT_SIZE;
  return snapFontSize(value);
}

function readTextColor(style) {
  const match = String(style ?? '').match(/\bcolor:\s*(#[0-9a-f]{3,8}|rgb\([^)]+\)|rgba\([^)]+\))/i);
  if (!match) return null;
  const color = match[1].toLowerCase().replace(/\s/g, '');
  if (color === '#000' || color === '#000000' || color === 'rgb(0,0,0)' || color === 'rgba(0,0,0,1)') {
    return null;
  }
  return match[1].trim();
}

function readInlineFormats(style) {
  const normalized = String(style ?? '').toLowerCase();
  const bold =
    /\bfont-weight:\s*(bold|[6-9]00)\b/.test(normalized)
    || /\bmso-bidi-font-weight:\s*bold\b/.test(normalized)
    || /\bmso-ansi-font-weight:\s*bold\b/.test(normalized);
  const italic =
    /\bfont-style:\s*italic\b/.test(normalized)
    || /\bmso-ansi-font-style:\s*italic\b/.test(normalized);
  const underline = /\btext-decoration:[^;]*underline\b/.test(normalized);
  const fontSize = parseFontSizePx(normalized);
  const color = readTextColor(normalized);
  return { bold, italic, underline, fontSize, color };
}

function isNormalFontWeight(style) {
  return /\bfont-weight:\s*(normal|[1-4]00)\b/i.test(String(style ?? ''));
}

function isNormalFontStyle(style) {
  return /\bfont-style:\s*normal\b/i.test(String(style ?? ''));
}

function isNoUnderline(style) {
  return /\btext-decoration:\s*none\b/i.test(String(style ?? ''));
}

function hasVisualInlineFormat(formats) {
  return Boolean(
    formats.bold
    || formats.italic
    || formats.underline
    || formats.color
    || (formats.fontSize && formats.fontSize !== DEFAULT_FONT_SIZE),
  );
}

function readBlockAlign(style) {
  const match = String(style ?? '').match(/text-align:\s*(left|center|right|justify)\b/i);
  if (!match) return null;
  const value = match[1].toLowerCase();
  return value === 'justify' ? 'left' : value;
}

function unwrapElement(element) {
  const parent = element.parentNode;
  if (!parent) return;
  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  parent.removeChild(element);
}

function replaceWithParagraphs(element, doc) {
  const text = element.textContent.replace(/\u00a0/g, ' ').trim();
  const p = doc.createElement('p');
  if (text) p.textContent = text;
  else p.appendChild(doc.createElement('br'));
  element.replaceWith(p);
}

function flattenTable(element, doc) {
  const rows = [...element.querySelectorAll('tr')];
  const lines = rows
    .map((row) =>
      [...row.querySelectorAll('td, th')]
        .map((cell) => cell.textContent.replace(/\u00a0/g, ' ').trim())
        .filter(Boolean)
        .join('\t'),
    )
    .filter(Boolean);
  const fragment = doc.createDocumentFragment();
  if (!lines.length) {
    fragment.appendChild(doc.createElement('br'));
  } else {
    lines.forEach((line) => {
      const p = doc.createElement('p');
      p.textContent = line;
      fragment.appendChild(p);
    });
  }
  element.replaceWith(fragment);
}

function applyInlineFormats(doc, node, formats) {
  let current = node;
  if (formats.bold) {
    const el = doc.createElement('b');
    current.appendChild(el);
    current = el;
  }
  if (formats.italic) {
    const el = doc.createElement('i');
    current.appendChild(el);
    current = el;
  }
  if (formats.underline) {
    const el = doc.createElement('u');
    current.appendChild(el);
    current = el;
  }

  const styleParts = [];
  if (formats.fontSize && formats.fontSize !== DEFAULT_FONT_SIZE) {
    styleParts.push(`font-size: ${formats.fontSize}px`);
  }
  if (formats.color) {
    styleParts.push(`color: ${formats.color}`);
  }
  if (styleParts.length) {
    const el = doc.createElement('span');
    el.setAttribute('style', styleParts.join('; '));
    current.appendChild(el);
    current = el;
  }

  return current;
}

function normalizeElement(element, doc) {
  if (!element.parentNode) return;

  const tag = element.tagName.toLowerCase();

  if (tag === 'table') {
    flattenTable(element, doc);
    return;
  }

  if (tag === 'thead' || tag === 'tbody' || tag === 'tr' || tag === 'td' || tag === 'th') {
    element.remove();
    return;
  }

  if (tag === 'a' || tag === 'font' || tag.includes(':')) {
    unwrapElement(element);
    return;
  }

  if (tag === 'img' || tag === 'video' || tag === 'audio' || tag === 'iframe' || tag === 'object' || tag === 'embed') {
    element.remove();
    return;
  }

  if (/^h[1-6]$/.test(tag)) {
    const fontSize = HEADING_FONT_SIZES[tag];
    const align = readBlockAlign(element.getAttribute('style'));
    const p = doc.createElement('p');
    if (align && align !== 'left') p.style.textAlign = align;
    const inner = applyInlineFormats(doc, p, { fontSize, bold: true, italic: false, underline: false });
    while (element.firstChild) inner.appendChild(element.firstChild);
    element.replaceWith(p);
    return;
  }

  if (!ALLOWED_TAGS.has(tag)) {
    const hasElementChild = [...element.children].length > 0;
    if (hasElementChild) {
      unwrapElement(element);
    } else {
      replaceWithParagraphs(element, doc);
    }
    return;
  }

  const styleAttr = element.getAttribute('style');
  const inlineFormats = readInlineFormats(styleAttr);
  const blockAlign = (tag === 'p' || tag === 'div' || tag === 'li')
    ? readBlockAlign(styleAttr)
    : null;

  element.removeAttribute('class');
  element.removeAttribute('id');
  [...element.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-') || attr.name.startsWith('on')) {
      element.removeAttribute(attr.name);
    }
  });

  if (tag === 'span') {
    if (!hasVisualInlineFormat(inlineFormats)) {
      unwrapElement(element);
      return;
    }
    element.removeAttribute('style');
    const children = [...element.childNodes];
    element.textContent = '';
    const target = applyInlineFormats(doc, element, inlineFormats);
    children.forEach((child) => target.appendChild(child));
    return;
  }

  if (tag === 'b' || tag === 'strong') {
    if (isNormalFontWeight(styleAttr)) {
      unwrapElement(element);
      return;
    }
    element.removeAttribute('style');
    return;
  }

  if (tag === 'i' || tag === 'em') {
    if (isNormalFontStyle(styleAttr)) {
      unwrapElement(element);
      return;
    }
    element.removeAttribute('style');
    return;
  }

  if (tag === 'u') {
    if (isNoUnderline(styleAttr)) {
      unwrapElement(element);
      return;
    }
    element.removeAttribute('style');
    return;
  }

  if (tag === 'p' || tag === 'div' || tag === 'li') {
    element.removeAttribute('style');
    if (blockAlign && blockAlign !== 'left') {
      element.style.textAlign = blockAlign;
    }
    if (hasVisualInlineFormat(inlineFormats)) {
      const children = [...element.childNodes];
      const target = applyInlineFormats(doc, element, inlineFormats);
      children.forEach((child) => target.appendChild(child));
    }
    return;
  }

  element.removeAttribute('style');
}

function cleanTree(root, doc) {
  const elements = [];
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let current = walker.nextNode();
  while (current) {
    elements.push(current);
    current = walker.nextNode();
  }

  for (let index = elements.length - 1; index >= 0; index -= 1) {
    normalizeElement(elements[index], doc);
  }

  [...root.querySelectorAll('span')].forEach((span) => {
    if (!span.attributes.length && span.parentNode) unwrapElement(span);
  });

  [...root.querySelectorAll('p, div')].forEach((block) => {
    if (!block.textContent.replace(/\u00a0/g, '').trim() && !block.querySelector('br, img')) {
      block.innerHTML = '<br>';
    }
  });
}

function stripDocumentBoilerplate(doc) {
  doc.querySelectorAll('style, script, meta, link, title, head').forEach((el) => el.remove());
  doc.body.querySelectorAll('[style*="display:none"], [style*="display: none"]').forEach((el) => el.remove());
}

/**
 * Giữ định dạng paste từ Word / Google Docs:
 * đậm, nghiêng, gạch chân, cỡ chữ, màu chữ, danh sách, căn lề, xuống dòng.
 */
export function sanitizePastedHtml(rawHtml) {
  const html = String(rawHtml ?? '').trim();
  if (!html) return '';

  const doc = new DOMParser().parseFromString(html, 'text/html');
  stripDocumentBoilerplate(doc);
  cleanTree(doc.body, doc);

  const result = doc.body.innerHTML
    .replace(/\u200B|\uFEFF/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  if (!result || !doc.body.textContent.replace(/\u00a0/g, '').trim()) {
    return '';
  }

  return result;
}

export function getPasteContent(clipboardData) {
  const html = clipboardData?.getData('text/html') ?? '';
  const sanitized = sanitizePastedHtml(html);
  if (sanitized) {
    return { type: 'html', value: sanitized };
  }

  const plain = clipboardData?.getData('text/plain') ?? '';
  if (plain) {
    return { type: 'text', value: plain };
  }

  return null;
}
