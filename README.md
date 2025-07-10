# YeSIM Test Project

A web application for searching and displaying eSIM cards by countries with internationalization support.

## 🚀 Tech Stack

- **Next.js 15.3.5** - React framework
- **TypeScript** - Type safety
- **next-i18next** - Internationalization (EN/RU)
- **CSS Modules** - Styling

## 📁 Project Structure

```
src/
├── pages/              # Next.js pages
│   ├── api/            # API endpoints
│   ├── country/        # Dynamic country pages
│   └── index.tsx       # Home page
├── components/         # React components
│   ├── Layout/         # Header and layout
│   ├── MainPage/       # Home page components
│   ├── CountryPage/    # Country page
│   └── Slider/         # FAQ slider
├── styles/            # Global styles
├── types/             # TypeScript types
├── utils/             # Utilities and API helpers
└── constants/         # Constants and fallback data

public/
├── locales/           # Translations (EN/RU)
└── flags/             # Country SVG flags
```

## 🛠 Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production server
npm run start

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:fix
```

## 🌍 Features

### Home Page
- Search countries by name/ISO code
- Display popular countries
- "Show all countries" button
- Language switcher (EN/RU)

### Country Pages
- Detailed country information
- Country flag display
- eSIM pricing plans
- SSG with ISR (Incremental Static Regeneration)
- Revalidation periods:
  - Default: 1 hour
  - Error state: 30 minutes

### API
- `/api/get-all-countries` - all countries
- `/api/get-popular-countries` - popular countries
- Integration with external API `api3.yesim.cc`
- Built-in error handling and fallback data

## 📋 Key Features

- **SSG with ISR**: 
  - 26 static pages:
    - 24 country pages (12 countries × 2 languages)
    - 2 home pages (EN/RU versions)
  - Automatic revalidation every hour
  - Faster revalidation on errors (30 minutes)
- **Fallback**: 
  - Backup data when API is unavailable
  - Graceful degradation for 429 errors
- **Caching**: 
  - Built-in Next.js caching
  - Optimized for CDN delivery
- **TypeScript**: 
  - Full project type safety
  - Path aliases for clean imports
- **Code Organization**:
  - Centralized constants
  - Type-safe API responses
  - Structured error handling

## 🔄 Path Aliases

```typescript
{
  "@/*": ["./src/*"],
  "@components/*": ["./src/components/*"],
  "@constants/*": ["./src/constants/*"],
  "@utils/*": ["./src/utils/*"],
  "@types/*": ["./src/types/*"],
  "@assets/*": ["./src/assets/*"],
  "@styles/*": ["./src/styles/*"],
  "@api/*": ["./src/pages/api/*"]
}
```

## 📦 Build Stats

- **Total Pages**: 34
  - 26 static pages (24 country + 2 home)
  - 2 dynamic API routes
  - 6 system pages (_app, 404, etc.)
- **Bundle Size**: ~104 KB shared JS
- **CSS Size**: 
  - Home: 1.61 KB
  - Country pages: 938 B
- **Build Time**: ~24 seconds for all pages
