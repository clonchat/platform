"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loading } from "@/components/ui/loading";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      await apiClient.resendVerificationEmail(email);
      setMessage(
        "Correo de verificación enviado. Revisa tu bandeja de entrada."
      );
    } catch (err: any) {
      setError(err.message || "Error al reenviar el correo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              ¡Revisa tu correo!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Te hemos enviado un enlace de verificación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirma que eres tú
                </h3>
                <p className="text-gray-600 mb-4">
                  Hemos enviado un enlace de verificación a tu correo
                  electrónico. Haz clic en el enlace para confirmar tu cuenta y
                  continuar.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>¿No ves el correo?</strong> Revisa tu carpeta de
                    spam o solicita un nuevo enlace de verificación.
                  </p>
                </div>
              </div>

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="border-t pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  ¿No recibiste el correo?
                </h4>
                <form onSubmit={handleResendVerification} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Tu email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Te enviaremos un nuevo enlace de verificación
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loading variant="dots" size="sm" />
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      "Enviar nuevo enlace"
                    )}
                  </Button>
                </form>
              </div>

              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  ¿Problemas con el correo?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Volver al login
                  </Link>
                </p>
                <p className="text-sm text-gray-500">
                  También revisa tu carpeta de spam
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
