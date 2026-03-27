import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'NV Homes | Thiết Kế & Thi Công Nội Thất Cao Cấp',
  description: 'Kiến tạo đẳng cấp cho ngôi nhà bạn - Thiết kế sáng tạo, thi công tận tâm, chất lượng từ tâm',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { ThemeProvider } from '@/components/landing/theme-provider'
import { ThemeToggleFixed } from '@/components/landing/theme-toggle-fixed'
import { FloatingCTA } from '@/components/landing/floating-cta'
import { AntiCopy } from '@/components/security/anti-copy'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AntiCopy />
          <ThemeToggleFixed />
          <Analytics />
          <Script 
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Ld-YOUR-SITE-KEY'}`} 
            strategy="afterInteractive" 
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
