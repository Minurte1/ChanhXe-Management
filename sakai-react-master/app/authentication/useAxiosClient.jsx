'use client';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import createAxiosInstance from './axiosInstance';

export const useAxios = () => {
  const pathname = usePathname();
  // Sử dụng useMemo để tránh tạo lại instance khi pathname không thay đổi
  const axiosInstance = useMemo(() => createAxiosInstance(pathname), [pathname]);
  return axiosInstance;
};
