import Link from "next/link";

import type { FooterLinks } from "../data";

interface IProps {
  data: FooterLinks;
}

export function FooterNavigationList({ data }: IProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{data.title}</h3>
      <ul className="space-y-3">
        {data.links.map(link => (
          <li key={link.name}>
            <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
