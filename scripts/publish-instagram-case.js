/**
 * Publica um caso clínico (carrossel) no Instagram via Graph API.
 *
 * SETUP (uma vez) — veja scripts/instagram-env.example
 *
 * Uso:
 *   node scripts/publish-instagram-case.js --dir "D:\MedHub_app\Divulgação\Casos Clinicos\Caso 1"
 *   node scripts/publish-instagram-case.js --dir "..." --dry-run
 *   node scripts/publish-instagram-case.js --dir "..." --upload-temp
 *
 * Requisitos env:
 *   META_ACCESS_TOKEN
 *   INSTAGRAM_BUSINESS_ACCOUNT_ID
 *   MEDHUB_PUBLIC_ORIGIN (opcional, default https://www.medhub.ia.br)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ROOT = path.join(__dirname, '..');
const GRAPH = 'https://graph.facebook.com/v21.0';

function loadEnv (file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return;
  fs.readFileSync(p, 'utf8').split(/\r?\n/).forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i < 1) return;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
}

['.env.production.local', '.env.local', '.env'].forEach(loadEnv);

function parseArgs () {
  const args = process.argv.slice(2);
  const out = { dryRun: false, uploadTemp: false, dir: '' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir' && args[i + 1]) out.dir = args[++i];
    else if (args[i] === '--dry-run') out.dryRun = true;
    else if (args[i] === '--upload-temp') out.uploadTemp = true;
    else if (args[i] === '--caption-file' && args[i + 1]) out.captionFile = args[++i];
  }
  return out;
}

function sleep (ms) {
  return new Promise(r => setTimeout(r, ms));
}

function requestJson (url, options = {}, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const data = body == null ? null : (typeof body === 'string' ? body : JSON.stringify(body));
    const req = lib.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: {
        ...(options.headers || {}),
        ...(data && options.method !== 'GET' ? {
          'Content-Type': options.contentType || 'application/json',
          'Content-Length': Buffer.byteLength(data)
        } : {})
      }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        let json = null;
        try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
        if (res.statusCode >= 400) {
          const err = new Error(json.error?.message || text || ('HTTP ' + res.statusCode));
          err.status = res.statusCode;
          err.body = json;
          reject(err);
          return;
        }
        resolve(json);
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function graphGet (pathname, params = {}) {
  const u = new URL(GRAPH + pathname);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') u.searchParams.set(k, String(v));
  });
  u.searchParams.set('access_token', process.env.META_ACCESS_TOKEN);
  return requestJson(u.toString());
}

function graphPost (pathname, params = {}) {
  const u = new URL(GRAPH + pathname);
  u.searchParams.set('access_token', process.env.META_ACCESS_TOKEN);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') u.searchParams.set(k, String(v));
  });
  return requestJson(u.toString(), { method: 'POST' }, '');
}

function listCaseImages (dir) {
  const files = [];
  for (let i = 1; i <= 20; i++) {
    const candidates = [
      path.join(dir, i + '.png'),
      path.join(dir, String(i).padStart(2, '0') + '.png'),
      path.join(dir, 'PUBLICAR_AGORA', 'FEED_carrossel_1a7', String(i).padStart(2, '0') + '.png')
    ];
    const hit = candidates.find(f => fs.existsSync(f));
    if (hit) files.push(hit);
    else if (i <= 7) {
      // keep looking for 1-7 only if later numbers miss after first gap
    }
  }
  if (!files.length) {
    // fallback: any numbered png sorted
    const all = fs.readdirSync(dir)
      .filter(n => /^\d+\.png$/i.test(n))
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
      .map(n => path.join(dir, n));
    return all;
  }
  return files;
}

function readCaption (dir, captionFile) {
  const tries = [
    captionFile,
    path.join(dir, 'PUBLICAR_AGORA', '1_LEGENDA_FEED.txt'),
    path.join(dir, 'Legenda.txt')
  ].filter(Boolean);
  for (const f of tries) {
    if (f && fs.existsSync(f)) return fs.readFileSync(f, 'utf8').trim();
  }
  return 'Caso clínico da semana · MedHub\nhttps://www.medhub.ia.br\n@medhub_app';
}

function slugFromDir (dir) {
  return path.basename(dir)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'caso';
}

function copyToPublic (images, slug) {
  const outDir = path.join(ROOT, 'public', 'ig', slug);
  fs.mkdirSync(outDir, { recursive: true });
  const urls = [];
  const origin = (process.env.MEDHUB_PUBLIC_ORIGIN || 'https://www.medhub.ia.br').replace(/\/$/, '');
  images.forEach((src, idx) => {
    const name = String(idx + 1).padStart(2, '0') + path.extname(src).toLowerCase();
    const dest = path.join(outDir, name);
    fs.copyFileSync(src, dest);
    urls.push(origin + '/ig/' + slug + '/' + name);
  });
  return { outDir, urls };
}

function httpHeadOk (url) {
  return new Promise(resolve => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request({
      method: 'HEAD',
      hostname: u.hostname,
      path: u.pathname + u.search,
      timeout: 15000
    }, res => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

/** Upload temporário (catbox) — só se --upload-temp */
function uploadTempCatbox (filePath) {
  return new Promise((resolve, reject) => {
    const boundary = '----MedHub' + Date.now();
    const fileBuf = fs.readFileSync(filePath);
    const filename = path.basename(filePath);
    const prefix = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="reqtype"\r\n\r\n` +
      `fileupload\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="fileToUpload"; filename="${filename}"\r\n` +
      `Content-Type: image/png\r\n\r\n`
    );
    const suffix = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([prefix, fileBuf, suffix]);

    const req = https.request({
      hostname: 'catbox.moe',
      path: '/user/api.php',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': body.length
      }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8').trim();
        if (res.statusCode >= 400 || !/^https?:\/\//i.test(text)) {
          reject(new Error('Upload temp falhou: ' + text));
          return;
        }
        resolve(text);
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function waitContainerReady (creationId, label) {
  for (let i = 0; i < 30; i++) {
    const st = await graphGet('/' + creationId, { fields: 'status_code,status' });
    const code = st.status_code || st.status;
    if (code === 'FINISHED' || code === 'PUBLISHED') return st;
    if (code === 'ERROR' || code === 'EXPIRED') {
      throw new Error('Container ' + label + ' falhou: ' + JSON.stringify(st));
    }
    await sleep(2000);
  }
  throw new Error('Timeout aguardando container ' + label);
}

async function publishCarousel (igId, imageUrls, caption, dryRun) {
  console.log('Criando itens do carrossel…', imageUrls.length);
  const children = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    console.log('  item', i + 1, url);
    if (dryRun) {
      children.push('dry_' + i);
      continue;
    }
    const item = await graphPost('/' + igId + '/media', {
      image_url: url,
      is_carousel_item: 'true'
    });
    if (!item.id) throw new Error('Sem id no item: ' + JSON.stringify(item));
    await waitContainerReady(item.id, 'item ' + (i + 1));
    children.push(item.id);
  }

  if (dryRun) {
    console.log('[dry-run] carrossel + publish pulados');
    console.log('caption length', caption.length);
    return { dryRun: true };
  }

  console.log('Criando container do carrossel…');
  const carousel = await graphPost('/' + igId + '/media', {
    media_type: 'CAROUSEL',
    children: children.join(','),
    caption
  });
  if (!carousel.id) throw new Error('Sem id carrossel: ' + JSON.stringify(carousel));
  await waitContainerReady(carousel.id, 'carousel');

  console.log('Publicando…');
  const published = await graphPost('/' + igId + '/media_publish', {
    creation_id: carousel.id
  });
  console.log('Publicado:', published);
  return published;
}

async function main () {
  const opts = parseArgs();
  const token = process.env.META_ACCESS_TOKEN;
  const igId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!opts.dir) {
    console.error('Uso: node scripts/publish-instagram-case.js --dir "caminho\\Caso 1"');
    process.exit(1);
  }
  if (!fs.existsSync(opts.dir)) {
    console.error('Pasta não encontrada:', opts.dir);
    process.exit(1);
  }
  if (!token || !igId) {
    console.error(`
Faltam variáveis de ambiente.

1) Copie scripts/instagram-env.example → .env.local
2) Preencha META_ACCESS_TOKEN e INSTAGRAM_BUSINESS_ACCOUNT_ID
3) Rode de novo

Passo a passo completo: scripts/INSTAGRAM_SETUP.txt
`);
    process.exit(1);
  }

  // sanity: token works
  try {
    const me = await graphGet('/' + igId, { fields: 'id,username' });
    console.log('Conta Instagram:', me.username || me.id);
  } catch (err) {
    console.error('Token/IG ID inválidos:', err.message);
    if (err.body) console.error(JSON.stringify(err.body, null, 2));
    process.exit(1);
  }

  const images = listCaseImages(opts.dir);
  if (images.length < 2) {
    console.error('Precisa de pelo menos 2 imagens numeradas (1.png…). Achadas:', images.length);
    process.exit(1);
  }
  console.log('Imagens:', images.length);

  const caption = readCaption(opts.dir, opts.captionFile);
  const slug = slugFromDir(opts.dir);

  let urls;
  if (opts.uploadTemp) {
    console.log('Upload temporário (catbox)…');
    urls = [];
    for (const f of images) {
      const u = await uploadTempCatbox(f);
      console.log('  ', path.basename(f), '→', u);
      urls.push(u);
      await sleep(500);
    }
  } else {
    const packed = copyToPublic(images, slug);
    console.log('Cópias em', packed.outDir);
    urls = packed.urls;
    console.log('Verificando se as URLs públicas respondem…');
    let ok = true;
    for (const u of urls) {
      const good = await httpHeadOk(u);
      console.log(good ? '  OK' : '  FALTA DEPLOY', u);
      if (!good) ok = false;
    }
    if (!ok) {
      console.error(`
As imagens ainda NÃO estão no ar em ${process.env.MEDHUB_PUBLIC_ORIGIN || 'https://www.medhub.ia.br'}.

Opção A (recomendada): commit/push da pasta public/ig/${slug}/ e aguarde o deploy Vercel.
  git add public/ig/${slug}
  git commit -m "content: Instagram caso ${slug}"
  git push

Opção B (rápida, sem deploy): rode com --upload-temp
  node scripts/publish-instagram-case.js --dir "${opts.dir}" --upload-temp
`);
      process.exit(1);
    }
  }

  const result = await publishCarousel(igId, urls, caption, opts.dryRun);
  console.log('\nPronto.');
  if (result.id) {
    console.log('media_id:', result.id);
  }
  console.log('\nStories: a API da Meta é limitada para stickers/enquetes.');
  console.log('Publique a sequência de stories no app ou Business Suite (arquivos já em PUBLICAR_AGORA).');
}

main().catch(err => {
  console.error('ERRO:', err.message);
  if (err.body) console.error(JSON.stringify(err.body, null, 2));
  process.exit(1);
});
