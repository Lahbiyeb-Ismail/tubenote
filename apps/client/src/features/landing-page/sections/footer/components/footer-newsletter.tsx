import { Mail } from "lucide-react";

import { Button, Input } from "@/components/ui";

export function FooterNewsletter() {
  return (
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
  );
}
