import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'OrbitusVR',
  description: 'A customizable virtual home environment',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        "font-sans antialiased",
        inter.variable
      )}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
