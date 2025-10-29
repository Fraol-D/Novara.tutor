# NovaraTutor

An MVP landing page for NovaraTutor — affordable 1:1 online tutoring for U.S. students. Built with Vite + React + TypeScript + Tailwind CSS + Framer Motion.

## ✨ Features

- � **Lead Generation Focus** – Clear "Book Free Lesson" CTA with Google Form integration placeholder
- �🇸 **U.S. Market Positioning** – Messaging tailored for American students and parents
- 🌓 **System-Adaptive Dark Mode** – Automatically matches device theme preference
- 📱 **Fully Responsive** – Optimized for mobile, tablet, and desktop devices
- ⚡ **Smooth Animations** – Framer Motion section transitions and hover effects
- 🔗 **Social Integration** – LinkedIn, Instagram, and X links in footer
- ♿ **Accessible** – Semantic HTML, ARIA labels, keyboard navigation support

## 📄 Page Structure

1. **Hero Hook** – "Affordable 1:1 Tutoring for U.S. Students — Try Your First Lesson Free"
2. **How It Works** – 3-step process (Book → Match → Learn)
3. **Visual Success** – Testimonial banner with verified badge placeholder
4. **Booking CTA** – Google Form embed placeholder for lead collection
5. **Testimonials** – "Coming Soon" section (greyed out until reviews are available)
6. **Footer** – Social links and navigation

## 🎨 Brand Theme

### Colors

- **Primary (Light)**: #008080 (teal)
- **Primary (Dark)**: #00a3a3 (lighter teal)
- **Accent**: #e59b25 (coral/orange)
- **Text (Light)**: #2e2f30
- **Text (Dark)**: #eaeaea
- **Background (Light)**: #ffffff
- **Background (Dark)**: #121212

### Typography

- **Fonts**: Inter, Poppins
- **Tone**: Warm, credible, family-oriented, and trustworthy

## 🛠️ Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS 3 with dark mode (system preference)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Linting**: ESLint 9 (flat config) + Prettier

## 📦 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Type-check and build for production
npm run preview  # Preview production build locally
npm run lint     # Lint TS/TSX files with ESLint
npm run format   # Format code with Prettier
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure

```
src/
├── components/
│   ├── Footer.tsx          # Footer with social icons
│   ├── Logo.tsx            # Refined logo with star accent
│   ├── Navbar.tsx          # Responsive navbar with theme toggle
│   ├── ThemeToggle.tsx     # Dark mode toggle button
│   └── Toast.tsx           # Notification toast component
├── contexts/
│   └── ThemeContext.tsx    # Dark mode context provider
├── sections/
│   ├── About.tsx           # About section
│   ├── Contact.tsx         # Contact form with validation
│   ├── Hero.tsx            # Hero with gradient background
│   ├── Services.tsx        # Services grid
│   └── Testimonials.tsx    # Student testimonials
├── App.tsx                 # Main app component
├── main.tsx                # Entry point with theme provider
└── index.css               # Global styles and Tailwind imports
```

## 🎨 Customization

### Update Logo

Replace the SVG in `src/components/Logo.tsx` and `public/favicon.svg` with your final brand assets.

### Modify Colors

Edit `tailwind.config.ts` to customize the color palette:

```ts
colors: {
  primary: {
    DEFAULT: '#008080',
    dark: '#00e1ff',
  },
  accent: '#e59b25',
  // ...
}
```

### Change Content

Update copy in `src/sections/*` components as needed.

### Social Links

Modify footer links in `src/components/Footer.tsx`:

```tsx
<a href="https://linkedin.com/company/your-company" ...>
```

## 🌐 Backend Integration

The contact form attempts to POST to `/api/contact` with this structure:

```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

If the API endpoint doesn't exist, it falls back to a demo endpoint (JSONPlaceholder) for testing.

To connect a real backend:

1. Deploy an API endpoint at `/api/contact` (e.g., Vercel serverless function, Netlify function, or Express route)
2. Handle the JSON payload and send emails via SendGrid, Resend, or similar service
3. Return appropriate status codes (200 for success, 4xx/5xx for errors)

## 📝 Notes

- **CSS Warnings**: Editor may flag `@tailwind` directives—these compile correctly via PostCSS
- **Dark Mode**: Automatically detects system preference on first visit, then remembers user choice
- **Icons**: Social icons use `lucide-react` for consistent styling and accessibility

## 📄 License

© 2025 NovaraTutor. All rights reserved.
