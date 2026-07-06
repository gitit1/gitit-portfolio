// Netlify Function (v2) — reuses the web-standard MCP handler in api/mcp.ts.
import handler from '../../api/mcp';

export const config = { path: '/api/mcp' };

export default (request: Request) => handler(request);
