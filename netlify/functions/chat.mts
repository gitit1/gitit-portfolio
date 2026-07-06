// Netlify Function (v2) — reuses the web-standard handler in api/chat.ts so the
// same code serves on Netlify, Vercel, or any host with a fetch runtime.
import handler from '../../api/chat';

export const config = { path: '/api/chat' };

export default (request: Request) => handler(request);
