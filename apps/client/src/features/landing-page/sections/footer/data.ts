export const quickLinks = {
  title: "Quick Links",
  links: [
    { name: "Home", href: "/" },
    { name: "Notes", href: "/notes" },
    { name: "Videos", href: "/videos" },
  ],
};

export const supportLinks = {
  title: "Support",
  links: [
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "/contact" },
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

export type FooterLinks = typeof quickLinks;
