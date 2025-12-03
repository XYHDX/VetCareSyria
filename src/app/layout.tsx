import { Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';

const body = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap'
});

const display = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${body.variable} ${display.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
