import { quickLinks, supportLinks } from "../data";
import { FooterBrand } from "./footer-brand";
import { FooterNavigationList } from "./footer-navigation-links";
import { FooterNewsletter } from "./footer-newsletter";

export function FooterGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {/* Brand */}
      <FooterBrand />

      {/* Quick Links */}
      <FooterNavigationList data={quickLinks} />

      {/* Support */}
      <FooterNavigationList data={supportLinks} />

      {/* Newsletter */}
      <FooterNewsletter />
    </div>
  );
}
