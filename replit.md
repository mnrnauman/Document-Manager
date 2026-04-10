# Gencore IT Solutions - Document Generator

A Next.js web application for generating professional business documents (invoices, quotations, letterheads) for Gencore IT Solutions.

## Architecture

- **Framework**: Next.js 15.3.9 (App Router)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Package Manager**: pnpm
- **Port**: 5000 (bound to 0.0.0.0 for Replit compatibility)

## Project Structure

- `app/` - Next.js App Router pages
  - `app/page.tsx` - Login page; redirects to /letterhead on success
  - `app/letterhead/page.tsx` - Letterhead document page (auth-guarded)
  - `app/invoice/page.tsx` - Invoice document page (auth-guarded)
  - `app/quotation/page.tsx` - Quotation document page (auth-guarded)
- `components/` - React components
  - `components/ui/` - shadcn/ui base components
  - `login-screen.tsx` - Authentication screen (credentials hardcoded)
  - `doc-nav.tsx` - Shared navigation bar (Letterhead / Invoice / Quotation + Logout)
  - `invoice-editor.tsx` - Full invoice editor with catalog dropdown, scrollable items, editable company info
  - `quotation-editor.tsx` - Full quotation editor with catalog dropdown, scrollable items, editable company info
  - `letterhead-editor.tsx` - Letterhead editor with editable company info
- `lib/predefined-items.ts` - 35+ predefined product catalog items
- `hooks/` - Custom React hooks
- `utils/pdf-generator.ts` - PDF generation utility
- `public/` - Static assets

## Features

- **Separate pages** per document type (/letterhead, /invoice, /quotation)
- **Shared navigation bar** with active-state highlighting
- **Editable company info** (email, phone, address, website, description) on all document editors — changes reflect in the live preview instantly
- **Items section at top** of the form with a scrollable container (max-height 420px)
- **Predefined product catalog** dropdown for quick item addition (invoices & quotations)
- **Draft save/load** via localStorage
- **PDF download** and **print** support
- **Auth guard** on all document pages (sessionStorage-based)

## Running the App

```bash
pnpm run dev   # development server on port 5000
pnpm run build # production build
pnpm run start # production server on port 5000
```

## Key Configuration

- `next.config.mjs` - Next.js config (image domains, security headers, allowedDevOrigins for Replit)
- `tailwind.config.ts` - Tailwind CSS config
- `tsconfig.json` - TypeScript config with `@/` path alias

## Security Notes

- Login credentials are hardcoded in `components/login-screen.tsx` (mnrnauman / precision9911) — move to environment variables for production
- Security headers: X-Frame-Options (SAMEORIGIN), X-Content-Type-Options, Referrer-Policy, Permissions-Policy
