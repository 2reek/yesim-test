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
├── styles/             # Global styles
├── types/              # TypeScript types
├── utils/              # Utilities and API helpers
└── constants/          # Constants and fallback data

public/
├── locales/            # Translations (EN/RU)
└── flags/              # Country SVG flags
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
- SSG for popular countries

### API
- `/api/get-all-countries` - all countries
- `/api/get-popular-countries` - popular countries
- Integration with external API `api3.yesim.cc`

## 📋 Key Features

- **SSG/SSR**: Popular countries are statically generated 24 pages (12 countries × 2 languages)
- **Fallback**: Backup data when API is unavailable
- **Caching**: Server-side and client-side data caching
- **Responsive**: Mobile-friendly adaptive design
- **TypeScript**: Full project type safety
