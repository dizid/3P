# Marketing Graphics Documentation

Complete documentation of all marketing graphics, icons, and visual assets for De 3 P's Decision-Making Toolkit.

## Brand Assets

### Logo
**File:** `/public/logo.svg`
- **Size:** Vector (200x200 viewBox)
- **Format:** SVG
- **Usage:** Main brand logo, PWA icon, Apple touch icon
- **Colors:** Gradient from #6366f1 (indigo) to #8b5cf6 (purple)
- **Features:**
  - "3P" text prominently displayed
  - "Decision Tools" subtitle
  - Three colored dots representing the 3 P's (green, blue, purple)
  - Decorative concentric circles

### Favicon
**File:** `/public/favicon.svg`
- **Size:** 32x32 viewBox (optimized for small sizes)
- **Format:** SVG
- **Usage:** Browser tab icon, bookmarks
- **Features:**
  - Simplified "3P" text
  - Rounded square background with gradient
  - Minimal accent dots for visual interest

## Social Media Assets

### Open Graph Image
**File:** `/public/og-image.svg`
- **Size:** 1200x630 (Facebook/LinkedIn recommended)
- **Format:** SVG
- **Usage:** Social media preview when sharing links
- **Features:**
  - Large "3P" logo with decorative circle
  - "De 3 P's" title and tagline
  - "8 Frameworks • AI-Powered • Free to Use" subtitle
  - Tool icon showcase grid
  - Gradient background with dot pattern

## Tool Icons

All tool icons are in `/public/icons/` directory, sized at 64x64 viewBox.

| Icon | File | Colors | Description |
|------|------|--------|-------------|
| **3 P's** | `3ps.svg` | Green, Blue, Purple | Three overlapping circles with central intersection |
| **10-10-10** | `10-10-10.svg` | Blue gradient | Clock face with hands showing different time perspectives |
| **Regret** | `regret.svg` | Purple gradient | Head silhouette with thought bubble containing "?" |
| **PMI** | `pmi.svg` | Green, Red, Orange | Three vertical sections: Plus, Minus, Interesting |
| **SWOT** | `swot.svg` | Green, Red, Blue, Orange | 2x2 grid with S, W, O, T labels |
| **Coin Flip** | `coin-flip.svg` | Gold gradient | Spinning coin with motion lines and shine effect |
| **Fear/Regret** | `fear-regret.svg` | Red gradient | 2x2 matrix with decision point and quadrant indicators |
| **Opportunity Cost** | `opportunity-cost.svg` | Cyan gradient | Balance scale comparing opportunity vs cost |

## Background Graphics

### Hero Pattern
**File:** `/public/backgrounds/hero-pattern.svg`
- **Size:** 1200x800
- **Usage:** Landing page hero section background
- **Features:**
  - Purple gradient base (indigo to purple)
  - Dot pattern overlay
  - Grid pattern overlay
  - Floating geometric shapes
  - Abstract decision tree visualization
  - Subtle wave at bottom

### Mesh Gradient
**File:** `/public/backgrounds/mesh-gradient.svg`
- **Size:** 1920x1080
- **Usage:** General background for content sections
- **Features:**
  - Light base color (#f8fafc)
  - Multiple overlapping radial gradients
  - Colors: Indigo, Purple, Emerald, Blue
  - Subtle noise texture overlay
  - Smooth, modern aesthetic

## Implementation

### HTML Meta Tags

All graphics are properly referenced in `index.html`:

```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">

<!-- PWA -->
<link rel="apple-touch-icon" href="/logo.svg">
<meta name="theme-color" content="#6366f1">

<!-- Open Graph -->
<meta property="og:image" content="https://de3ps.nl/og-image.svg">

<!-- Twitter -->
<meta property="twitter:image" content="https://de3ps.nl/og-image.svg">
```

### PWA Manifest

`/public/manifest.json` includes:
- SVG and PNG icons for all sizes
- App screenshots using og-image.svg
- Shortcuts to key tools with custom icons
- Theme colors and display modes

## Usage Guidelines

### Colors

Primary brand colors:
- **Indigo:** #6366f1 (Primary brand color)
- **Purple:** #8b5cf6 (Secondary brand color)
- **Light Purple:** #a855f7 (Accent)
- **Emerald:** #10b981 (Poen/Money)
- **Blue:** #3b82f6 (Pret/Fun)
- **Violet:** #a855f7 (Prestige/Status)

### Icon Usage

- Tool icons can be used in navigation, cards, and CTAs
- Always maintain aspect ratio
- Minimum size: 24x24px for clarity
- Recommended sizes: 32x32, 48x48, 64x64, 96x96

### Background Usage

- Hero pattern: Best for full-width hero sections
- Mesh gradient: Ideal for content backgrounds, modals, cards
- Both can be used as CSS background-image
- Consider using background-size: cover for responsiveness

## File Sizes

All graphics are SVG format, providing:
- ✅ Infinite scalability
- ✅ Small file sizes (0.7KB - 2.2KB)
- ✅ Fast loading
- ✅ Sharp rendering at any resolution
- ✅ Easy to modify and customize

## Testing

All graphics tested and verified:
- ✅ Accessible via HTTP (200 status)
- ✅ Meta tags properly implemented
- ✅ PWA manifest correctly configured
- ✅ Social media preview working
- ✅ Favicon displaying in browser tabs
- ✅ Icons rendering correctly at all sizes

## SEO Assets

### Sitemap
**File:** `/public/sitemap.xml`
- Lists all public pages
- Includes image sitemap data
- Proper priority and change frequency

### Robots.txt
**File:** `/public/robots.txt`
- Allows all search engines
- References sitemap
- Protects sensitive endpoints

## Future Improvements

Consider adding:
- [ ] Animated versions of tool icons (for hover states)
- [ ] Dark mode variants of backgrounds
- [ ] Additional social media sizes (Instagram, Pinterest)
- [ ] Video preview for rich social cards
- [ ] PNG fallbacks for older browsers
- [ ] WebP versions for performance optimization
