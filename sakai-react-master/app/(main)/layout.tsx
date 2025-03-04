'use client';
import { Metadata } from 'next';
import Layout from '../../layout/layout';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { enqueueSnackbar } from 'notistack';
import { verifyAdmin } from '../services/userAccountService';
import { Box, CircularProgress } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
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
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const patchName = usePathname();
  useEffect(() => {
    const checkUserRole = async () => {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        enqueueSnackbar('Bạn không có quyền truy cập vào trang này', {
          variant: 'info'
        });
        setLoading(false);
        return;
      }

      try {
        const role = await verifyAdmin(accessToken);
        setUserRole(role);
      } catch (error) {
        setUserRole(null);
      }
      setLoading(false);
    };

    checkUserRole();
  }, []);
  console.log('patchName', patchName);
  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (userRole === 'admin') {
    return <Layout>{children}</Layout>;
  }

  return router.push('/auth/login');
}
