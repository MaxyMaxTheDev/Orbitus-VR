import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Orbitron, Chakra_Petch } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'NexusVR',
  description: 'A customizable virtual home environment',
};

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '700', '900']
});

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  variable: '--font-chakra-petch',
  weight: ['400', '500', '700']
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        "font-body antialiased",
        orbitron.variable,
        chakraPetch.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
