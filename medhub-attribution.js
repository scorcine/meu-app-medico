/* Origem da divulgação (Instagram etc.) — persiste até o checkout Stripe */

const MEDHUB_ATTR_STORAGE = 'medhub-attribution-v1';
const MEDHUB_ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];

function medhubLoadAttribution () {
  try {
    const raw = localStorage.getItem(MEDHUB_ATTR_STORAGE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function medhubSaveAttribution (data) {
  if (!data || typeof data !== 'object') return;
  try {
    localStorage.setItem(MEDHUB_ATTR_STORAGE, JSON.stringify(data));
  } catch { /* ignore quota */ }
}

function medhubSanitizeAttrValue (value) {
  return String(value || '').trim().slice(0, 120);
}

function medhubCaptureAttributionFromUrl () {
  const params = new URLSearchParams(window.location.search);
  const incoming = {};

  MEDHUB_ATTR_KEYS.forEach(function (key) {
    const value = params.get(key);
    if (value) incoming[key] = medhubSanitizeAttrValue(value);
  });

  if (incoming.ref && !incoming.utm_source) {
    incoming.utm_source = incoming.ref;
  }

  if (!Object.keys(incoming).length) {
    return medhubLoadAttribution();
  }

  const merged = {
    ...(medhubLoadAttribution() || {}),
    ...incoming,
    capturedAt: Date.now()
  };
  medhubSaveAttribution(merged);
  return merged;
}

function medhubGetAttributionPayload () {
  const stored = medhubLoadAttribution() || {};
  const payload = {};
  MEDHUB_ATTR_KEYS.forEach(function (key) {
    if (key === 'ref') return;
    if (stored[key]) payload[key] = stored[key];
  });
  if (!payload.utm_source && stored.ref) payload.utm_source = stored.ref;
  return payload;
}

function medhubBuildMarketingUrl (relativePath, medium, campaign) {
  const params = new URLSearchParams({
    utm_source: 'instagram',
    utm_medium: medhubSanitizeAttrValue(medium) || 'bio',
    utm_campaign: medhubSanitizeAttrValue(campaign) || 'medhub'
  });
  const path = String(relativePath || 'index.html');
  const hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    return path.slice(0, hashIndex) + '?' + params.toString() + path.slice(hashIndex);
  }
  return path + '?' + params.toString();
}

document.addEventListener('DOMContentLoaded', function () {
  medhubCaptureAttributionFromUrl();
});
