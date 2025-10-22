"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Clonchat</h3>
            <p className="text-sm">{t("footer_about_text")}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              {t("footer_links")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white">
                  {t("nav_features")}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white">
                  {t("nav_how_it_works")}
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white">
                  {t("nav_clients")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              {t("footer_legal")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  {t("footer_privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  {t("footer_terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              {t("footer_contact")}
            </h4>
            <p className="text-sm">contact@clonchat.com</p>
            <p className="text-sm mt-2">{t("footer_global")}</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            © {currentYear} Clonchat. {t("footer_rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

