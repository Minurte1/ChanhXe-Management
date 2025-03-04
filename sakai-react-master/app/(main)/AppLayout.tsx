'use client'; // Make it a client component

import Layout from '../../layout/layout';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  useEffect(() => {
    const token = Cookies.get('accessToken');
    console.log('token', token);
  }, []);

  return <Layout>{children}</Layout>;
}
