// old token name (no leading --) -> new name. Many-to-one entries are deliberate merges (identical engine step).
export const COLOR = {
  'ig-blue':'color-accent-blue','ig-blue-hover':'color-accent-blue-hover','ig-blue-press':'color-accent-blue-active','ig-violet':'color-accent-violet','ig-sky':'color-accent-sky','ig-teal':'color-accent-teal',
  'action':'color-action-default','action-hover':'color-action-hover','action-hover-fill':'color-action-fill-hover','action-press':'color-action-active','on-action':'color-action-on',
  'action-soft':'color-action-subtle','action-soft-border':'color-action-subtle-border',
  'utility-link':'color-link-utility','utility-link-hover':'color-link-utility-hover','link-on-dark':'color-link-inverse','link-on-dark-hover':'color-link-inverse-hover',
  'link-footer':'footer-link','link-footer-hover':'footer-link-hover','focus-ring':'color-focus-default','focus-ring-dark':'color-focus-inverse',
  'ink':'color-text-heading','text-strong':'color-text-primary','text-body':'color-text-secondary','text-body-alt':'color-text-ui','text-muted':'color-text-muted','text-utility':'color-text-secondary',
  'text-eyebrow':'color-action-default','text-on-dark':'color-text-inverse','text-on-dark-muted':'color-text-inverse-muted','text-label':'color-text-muted','text-card-body':'color-text-muted','text-count':'color-text-muted',
  'text-chevron':'color-icon-subtle','text-error-on-dark':'color-feedback-error-inverse',
  'surface-page':'color-surface-page','surface-hero-top':'color-surface-hero','surface-band':'color-surface-subtle','surface-chrome':'color-surface-subtle','surface-callout':'color-surface-subtle','surface-chip':'color-surface-subtle',
  'surface-card':'color-surface-card','surface-tint':'color-surface-tint','surface-catalog':'color-surface-tint','surface-release':'color-surface-tint','surface-mono':'color-surface-tint',
  'surface-release-hover':'color-surface-tint-strong','surface-soon':'color-surface-muted','surface-dark':'color-surface-inverse',
  'border':'color-border-default','border-subtle':'color-border-subtle','border-tint':'color-border-default','border-chip':'color-border-default','border-blue':'color-border-accent','border-outline':'color-border-accent',
  'emphasis-border':'color-emphasis-border','emphasis-ring':'color-emphasis-ring','emphasis-ring-hover':'color-emphasis-ring-hover','scrim':'color-overlay-scrim','surface-nav':'nav-background',
  'footer-bg':'footer-background','footer-field':'footer-field-background','footer-field-pill':'footer-field-pill-background','footer-check-bg':'footer-check-background','footer-soc-hover-bg':'footer-social-hover-background','footer-soc-hover-border':'footer-social-hover-border','footer-card-fill':'footer-card-background','footer-bg-gradient':'footer-background-gradient',
  'badge-bundle-bg':'badge-bundle-background','badge-bundle-fg':'badge-bundle-color','badge-oss-bg':'badge-oss-background','badge-oss-fg':'badge-oss-color',
  'badge-yes-bg':'table-mark-yes-background','badge-yes-fg':'table-mark-yes-color','badge-warn-bg':'table-mark-partial-background','badge-warn-fg':'table-mark-partial-color','badge-no-bg':'table-mark-no-background','badge-no-fg':'table-mark-no-color',
  'table-head-sub':'table-header-sub-color','table-head-sub-ours':'table-header-sub-highlight-color','table-head-detail':'table-header-detail-color',
  'fw-angular-bg':'fw-angular-background','fw-react-bg':'fw-react-background','fw-wc-bg':'fw-webcomponents-background','fw-wc-border':'fw-webcomponents-border','fw-winforms-bg':'fw-winforms-background','fw-blazor-bg':'fw-blazor-background','fw-wpf-bg':'fw-wpf-background',
};
export const SIZEMAP = {
  'size-border':'border-width-default','size-border-strong':'border-width-strong','size-focus-ring':'focus-ring-width','size-focus-offset':'focus-ring-offset','size-dot':'window-dot-size',
  'size-control-cta':'size-control-md','size-touch':'size-control-xl','size-nav':'nav-height','size-mono':'badge-mono-size','size-logo-fw':'fw-logo-height','size-logo-nav':'logo-height','size-logo-product':'product-logo-height','size-logo-max':'product-logo-max-width',
  'size-badge-offset':'stat-badge-offset','size-badge-inset':'stat-badge-inset','size-glow-lg':'glow-size-lg','size-glow-md':'glow-size-md','size-field-min':'field-min-width','size-callout-min':'callout-min-width','size-callout-max':'callout-max-width',
  'size-newsletter-min':'newsletter-min-width','size-footer-col-min':'footer-column-min-width','size-panel':'nav-panel-max-width','size-bleed':'bleed-width','container':'container-max-width','container-hero':'container-hero-max-width','container-prose':'container-prose-max-width','catalog-min':'catalog-card-min-width',
  'radius-pill':'radius-full','radius-flare':'nav-panel-radius','radius-lg':'radius-xl','radius-card':'radius-lg','radius-media':'radius-lg','radius-tile':'radius-md','radius-link':'radius-md','radius-mono':'radius-sm','radius-badge':'radius-xs','radius-check':'radius-xs',
};
export const OTHER = {
  'weight-regular':'font-weight-regular','weight-medium':'font-weight-medium','weight-semibold':'font-weight-semibold','weight-bold':'font-weight-bold','weight-extrabold':'font-weight-extrabold','weight-black':'font-weight-black',
  'tracking-label':'letter-spacing-label','tracking-badge':'letter-spacing-badge','tracking-mono':'letter-spacing-mono',
  'dur-chip':'duration-chip','dur-fast':'duration-fast','dur-button':'duration-button','dur-slow':'duration-slow','dur-float':'duration-float','ease':'easing-default','transition':'transition-default',
  'z-base':'z-index-base','z-raised':'z-index-raised','z-media':'z-index-media','z-lift':'z-index-lift','z-sticky':'z-index-sticky','z-nav':'z-index-nav','z-panel':'z-index-panel','z-overlay':'z-index-overlay',
  'bp-sm':'breakpoint-sm','bp-md':'breakpoint-md','bp-lg':'breakpoint-lg','bp-xl':'breakpoint-xl',
  'blur-nav':'nav-backdrop-blur','gutter':'container-gutter','grid-split':'layout-split','emphasis-fill':'gradient-emphasis','border-gradient-bundle':'gradient-border-bundle',
  'shadow-card':'shadow-none','shadow-catalog-card':'shadow-none','shadow-card-hover':'shadow-raised','shadow-cta':'shadow-accent-lg','shadow-cta-hover':'shadow-accent-lg','shadow-pill-hover':'shadow-accent-sm','shadow-media':'shadow-overlay','shadow-badge':'shadow-floating','shadow-bundle':'shadow-accent-md','shadow-release':'callout-release-shadow','shadow-release-hover':'callout-release-shadow-hover','shadow-panel-filter':'shadow-popover-filter',
};
export const SPACEMAP = { 2:2,4:4,6:8,8:8,10:8,12:12,14:12,16:16,18:16,20:20,22:24,24:24,26:24,28:32,30:32,32:32,34:32,36:40,40:40,44:48,48:48,52:48,56:64,64:64,104:104 };
export const NEWSPACE = [2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 104];
export const ALL = { ...COLOR, ...SIZEMAP, ...OTHER };
