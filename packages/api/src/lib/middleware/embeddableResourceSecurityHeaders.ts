import type { Options } from '@middy/http-security-headers';

/**
 * Overrides for `@middy/http-security-headers` so responses can be embedded
 * cross-origin (e.g. `<img src="https://media…/images/…">`).
 *
 * Middy's defaults include `Cross-Origin-Resource-Policy: same-origin` and
 * `Cross-Origin-Embedder-Policy: require-corp`, which cause browsers to block
 * those embeds when the app runs on another origin.
 *
 * Pass this as `securityHeadersOptions` in `middyfy()` for handlers that serve
 * resources embedded by other sites.
 */
export const embeddableResourceSecurityHeaders: SecurityHeadersOptions = {
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
};

export type SecurityHeadersOptions = {
    [K in keyof Options]?: Options[K] | false;
};
