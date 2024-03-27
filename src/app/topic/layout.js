'use client';
import { FullPageContent } from '@/componentsH5/FullPageContent';
import Header from '@/components/header';
import { isWeb } from '@/util/common';
import { useTranslation } from 'next-i18next';

export default function Layout({ children }) {
  const { t } = useTranslation();

  return isWeb() ? (
    <>{children}</>
  ) : (
    <FullPageContent>

      {children}
    </FullPageContent>
  );
}
