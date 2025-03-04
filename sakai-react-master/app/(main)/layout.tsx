import { Metadata } from 'next';
import AppLayout from './AppLayout'; // Import the client component

export const metadata: Metadata = {
  title: 'Quản Lý Chành Xe || Hệ Thống Quản Lý',
  description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
  robots: { index: false, follow: false },
  viewport: { initialScale: 1, width: 'device-width' },
  openGraph: {
    type: 'website',
    title: 'PrimeReact SAKAI-REACT',
    url: 'https://sakai.primereact.org/',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
    images: ['https://www.primefaces.org/static/social/sakai-react.png'],
    ttl: 604800
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>; // Wrap with Client Component
}
