"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Mail, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import emailjs from "@emailjs/browser";

type ContactModalContextValue = {
  open: () => void;
  close: () => void;
};

const listeners: Array<(open: boolean) => void> = [];

export const useContactModal = (): ContactModalContextValue => {
  const open = useCallback(() => {
    listeners.forEach((l) => l(true));
  }, []);
  const close = useCallback(() => {
    listeners.forEach((l) => l(false));
  }, []);
  return { open, close };
};

export function ContactModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = (open: boolean) => setIsOpen(open);
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);

  return (
    <>
      {children}
      {isOpen && <ContactModal />}
    </>
  );
}

function ContactModal() {
  const { close } = useContactModal();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div className="relative bg-white w-[90%] max-w-lg rounded-2xl shadow-2xl p-6 md:p-8">
        <button
          aria-label="Close"
          className="absolute right-3 top-3 p-2 rounded-md hover:bg-gray-100"
          onClick={close}
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#2563eb] rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {t("contact_title")}
          </h3>
        </div>
        <p className="text-gray-600 mb-6">{t("contact_desc")}</p>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            setSubmitStatus("idle");

            try {
              const form = e.currentTarget as HTMLFormElement;
              const formData = new FormData(form);

              const templateParams = {
                to_email: "codeintime.dev@gmail.com",
                from_name: formData.get("name"),
                from_email: formData.get("email"),
                company: formData.get("company") || "",
                message: `Nuevo mensaje de contacto desde ClonChat:

Nombre: ${formData.get("name")}
Email: ${formData.get("email")}
Empresa: ${formData.get("company") || "No especificada"}

Mensaje:
${formData.get("message")}

---
Enviado desde el formulario de contacto de ClonChat`,
              };

              await emailjs.send(
                "service_9e7uyzc",
                "template_re5cvzf",
                templateParams,
                "sYp_HQSVI7WOCwQhY"
              );

              setSubmitStatus("success");
              form.reset();

              // Auto close after 3 seconds
              setTimeout(() => {
                close();
                setSubmitStatus("idle");
              }, 3000);
            } catch (error) {
              console.error("Error sending email:", error);
              setSubmitStatus("error");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder={t("contact_name_placeholder")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
            <input
              name="email"
              type="email"
              placeholder={t("contact_email_placeholder")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
          </div>
          <input
            name="company"
            placeholder={t("contact_company_placeholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          />
          <textarea
            name="message"
            placeholder={t("contact_message_placeholder")}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          />
          {submitStatus === "success" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ¡Mensaje enviado correctamente! Te contactaremos pronto.
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                Error al enviar el mensaje. Por favor, inténtalo de nuevo.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                close();
                setSubmitStatus("idle");
              }}
              disabled={isLoading}
            >
              {t("contact_cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                t("contact_send")
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 pt-2">
            Tu mensaje será enviado directamente a nuestro equipo
          </p>
        </form>
      </div>
    </div>
  );
}
