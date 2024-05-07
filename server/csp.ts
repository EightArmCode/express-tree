import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Response } from 'express'

export default {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ['\'self\''],
      'script-src': [
        '\'self\'',
        'https://unpkg.com/vue@3.4.26/dist/vue.esm-browser.js',
        'https://cdn.jsdelivr.net/npm/d3-hierarchy@3.1.2/+esm',
        'https://cdn.jsdelivr.net/npm/d3-scale@4.0.2/+esm',
        'https://cdn.jsdelivr.net/npm/d3-shape@3.2.0/+esm',
        'https://unpkg.com/axios@1.6.8/dist/esm/axios.min.js',
        'https://cdn.jsdelivr.net/npm/d3-path@3.1.0/+esm',
        // Include this nonce in the `script-src` directive.
        (_req: unknown, res: ServerResponse<IncomingMessage>) => `'nonce-${(res as Response).locals.cspNonce}'`,
        '\'unsafe-inline\'',
        '\'unsafe-eval\'', // Disocvered after writing the app using Vue 3 without a build step that it is not compliant with CSP. Do not use this in production. The alternative is to use the render function, but the syntax is not easy to read (and it is syntactically drastically different from vue templates).
      ],
      'style-src': [
        '\'self\'',
        'https://fonts.googleapis.com',
        (_req: unknown, res: ServerResponse<IncomingMessage>) => `'nonce-${(res as Response).locals.cspNonce}'`,
        '\'unsafe-inline\'',
      ],
      'object-src': ['\'none\''],
      'connect-src': ['\'self\''],
    },
  },
}
