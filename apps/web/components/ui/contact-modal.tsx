"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import emailjs from "@emailjs/browser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      <ContactModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

function ContactModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { close } = useContactModal();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563eb] rounded-lg flex items-center justify-center">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {t("contact_title")}
            </DialogTitle>
          </div>
          <p className="text-gray-600">{t("contact_desc")}</p>
        </DialogHeader>
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
            <Input
              name="name"
              placeholder={t("contact_name_placeholder")}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder={t("contact_email_placeholder")}
              required
            />
          </div>
          <Input
            name="company"
            placeholder={t("contact_company_placeholder")}
          />
          <Textarea
            name="message"
            placeholder={t("contact_message_placeholder")}
            rows={4}
          />
          {submitStatus === "success" && (
            <Alert>
              <AlertDescription>
                ¡Mensaje enviado correctamente! Te contactaremos pronto.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert variant="destructive">
              <AlertDescription>
                Error al enviar el mensaje. Por favor, inténtalo de nuevo.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                close();
                setSubmitStatus("idle");
              }}
              disabled={isLoading}
            >
              {t("contact_cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                t("contact_send")
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 pt-2">
            Tu mensaje será enviado directamente a nuestro equipo
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
