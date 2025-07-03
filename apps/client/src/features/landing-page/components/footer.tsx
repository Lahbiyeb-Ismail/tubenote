import { Mail } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/global";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-gray-400 leading-relaxed">
              Enhancing your learning experience with smart video note-taking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Notes</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Video</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for tips and updates.</p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            ©
            {" "}
            {new Date().getFullYear()}
            {" "}
            TubeNote. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
