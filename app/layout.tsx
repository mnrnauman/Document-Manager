import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | GENCORE",
    default: "Document Generator | GENCORE",
  },
  description: "Professional document generator for GENCORE",
  metadataBase: new URL("https://document.gencoreit.com"),
  alternates: {
    canonical: "/",
  },
  authors: [
    {
      name: "GENCORE",
      url: "https://gencoreit.com",
    },
  ],
  generator: "Next.js",
  applicationName: "GENCORE Document Generator",
  keywords: ["GENCORE", "document generator", "invoice", "quotation", "letterhead"],
  creator: "GENCORE",
  publisher: "GENCORE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://document.gencoreit.com",
    title: "Document Generator | GENCORE",
    description: "Professional document generator for GENCORE",
    siteName: "GENCORE",
    images: [
      {
        url: "https://document.gencoreit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GENCORE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Document Generator | GENCORE",
    description: "Professional document generator for GENCORE",
    images: ["https://document.gencoreit.com/og-image.jpg"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Force the browser to use our title */}
        <title>Document Generator | GENCORE</title>

        {/* Additional meta tags for consistent domain display */}
        <meta property="og:site_name" content="document.gencoreit.com" />
        <meta name="application-name" content="document.gencoreit.com" />

        {/* Favicon links for cross-browser support */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
