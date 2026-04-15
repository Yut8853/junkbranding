import { PrivacyBackground } from '@/components/privacy-background';

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PrivacyBackground />
      {children}
    </>
  );
}
