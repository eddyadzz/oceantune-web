import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { getNavLinks, getFooterLinks, getCompany, getSettings } from '@/lib/cms';
import { themeCss } from '@/lib/theme';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navLinks, footerLinks, company, settings] = await Promise.all([
    getNavLinks(),
    getFooterLinks(),
    getCompany(),
    getSettings(),
  ]);

  const themeStyle = themeCss(settings);
  const logoImage = settings['brand.logoImage'] ?? '';

  return (
    <>
      {themeStyle && <style dangerouslySetInnerHTML={{ __html: themeStyle }} />}
      <Navbar links={navLinks} company={company} logoImage={logoImage} />
      <main>{children}</main>
      <Footer
        navLinks={footerLinks}
        company={company}
        logoImage={logoImage}
        copyright={settings['footer.copyright'] ?? ''}
      />
    </>
  );
}