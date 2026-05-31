import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'OrbitusVR',
  description: 'A customizable virtual home environment',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("font-sans antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
