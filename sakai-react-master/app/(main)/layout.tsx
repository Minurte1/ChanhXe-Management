'use client';
import { Metadata } from 'next';
import Layout from '../../layout/layout';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
interface AppLayoutProps {
  children: React.ReactNode;
}

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

export default function AppLayout({ children }: AppLayoutProps) {
  useEffect(() => {
    const token = Cookies.get('accessToken');
    console.log('token', token);
  });
  return <Layout>{children}</Layout>;
}
