import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const SocialNav = () => {
  return (
    <div className="flex items-center gap-4 ml-auto">
      <a
        href="https://facebook.com/your-page"
        className="text-white hover:text-gray-300 transition-colors"
        aria-label="Facebook"
      >
        <Facebook size={20} />
      </a>
      <a
        href="https://instagram.com/your-handle"
        className="text-white hover:text-gray-300 transition-colors"
        aria-label="Instagram"
      >
        <Instagram size={20} />
      </a>
      <a
        href="https://linkedin.com/company/your-company"
        className="text-white hover:text-gray-300 transition-colors"
        aria-label="LinkedIn"
      >
        <Linkedin size={20} />
      </a>
    </div>
  );
};

export default SocialNav;