'use client';
import { AboutUsLinksData } from '@/components/Footer/Links';
import useHtmlContent, { HtmlType } from '@/hook/useHtmlContent';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { HtmlContent } from './HtmlContent';
import FaqContent from '@/components/faq';

export default function Page({ params }) {
  const pathname = usePathname();
  const { htmlContent: TNC } = useHtmlContent(HtmlType.tc);
  const { t } = useTranslation();

  const tncClasses = `terms-pop flex flex-col flex-[1_0_0] overflow-y-auto text-13`;

  return (
    <>
  <p>H5</p>
    </>
  );
}
