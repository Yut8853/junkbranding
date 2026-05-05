import { PrivacyBackground } from '@/components/effects/privacy-background';
import type { LayoutProps } from '@/types/layout';

export default function PrivacyLayout({
  children,
}: LayoutProps) {
  return (
    <>
      <PrivacyBackground />
      {children}
    </>
  );
}
