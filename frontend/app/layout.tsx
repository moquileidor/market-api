import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'MarketAPI',
  description: 'Tienda online — Proyecto integrador Estud-IA Tech',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable} style={{ colorScheme: 'light' }}>
      <body style={{ backgroundColor: '#fafafa', color: '#111111' }} className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">{children}</main>
          <Footer />
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
