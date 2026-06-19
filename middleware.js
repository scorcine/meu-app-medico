const REDIRECT_HOSTS = new Set([
  'meu-app-medico.vercel.app',
  'medhub.ia.br'
]);

const CANONICAL_ORIGIN = 'https://www.medhub.ia.br';

export const config = {
  matcher: ['/((?!_vercel).*)']
};

export default function middleware (request) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();

  if (!REDIRECT_HOSTS.has(host)) {
    return;
  }

  const target = new URL(url.pathname + url.search, CANONICAL_ORIGIN);
  return Response.redirect(target.toString(), 308);
}
