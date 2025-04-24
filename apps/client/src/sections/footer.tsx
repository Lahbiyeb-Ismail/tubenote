import { Facebook, Github, Twitter } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { footerQuickLinks, footerSupportLinks } from "@/utils";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-red-600">TUBE</span>
              <span className="text-gray-800">NOTE</span>
            </h2>
            <p className="text-gray-600">
              Enhancing your learning experience with smart video note-taking.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerQuickLinks.map(({ icon: Icon, link, text }) => (
                <li key={text}>
                  <a
                    href={link}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Support
            </h3>
            <ul className="space-y-2">
              {footerSupportLinks.map(({ text, link, icon: Icon }) => (
                <li key={text}>
                  <a
                    href={link}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for tips and updates.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
              <Button className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="/facebook"
              className="text-gray-400 hover:text-red-600 transition-colors duration-200"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="/twitter"
              className="text-gray-400 hover:text-red-600 transition-colors duration-200"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="/github"
              className="text-gray-400 hover:text-red-600 transition-colors duration-200"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
          <p className="text-gray-600">© 2024 TubeNote. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
