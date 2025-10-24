"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

interface BusinessData {
  name: string;
  description: string;
  subdomain: string;
  visualConfig: {
    logoUrl?: string;
    theme: "light" | "dark";
    welcomeMessage: string;
  };
  appointmentConfig: {
    services: {
      id: string;
      name: string;
      duration: number;
      price?: number;
    }[];
  };
  availability: {
    day:
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday";
    slots: { start: string; end: string }[];
  }[];
}

interface SetupSpecificDataProps {
  businessData: BusinessData;
  setBusinessData: (data: BusinessData) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function SetupSpecificData({
  businessData,
  setBusinessData,
  onNext,
}: SetupSpecificDataProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Máximo 2MB.");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida.");
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for temporary storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBusinessData({
          ...businessData,
          visualConfig: {
            ...businessData.visualConfig,
            logoUrl: result,
          },
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading logo:", error);
      setIsUploading(false);
    }
  };

  const removeLogo = () => {
    setBusinessData({
      ...businessData,
      visualConfig: {
        ...businessData.visualConfig,
        logoUrl: undefined,
      },
    });
  };

  const handleThemeChange = (theme: "light" | "dark") => {
    setBusinessData({
      ...businessData,
      visualConfig: {
        ...businessData.visualConfig,
        theme,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Configuración Visual
        </h2>
        <p className="text-gray-600">Personaliza la apariencia de tu chatbot</p>
      </div>

      <div className="space-y-6">
        {/* Logo Upload */}
        <div className="space-y-2">
          <Label>Logo del Negocio</Label>
          <div className="flex items-center space-x-4">
            {businessData.visualConfig.logoUrl ? (
              <div className="relative">
                <img
                  src={businessData.visualConfig.logoUrl}
                  alt="Logo preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
            )}

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {isUploading ? "Subiendo..." : "Subir Logo"}
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 2MB</p>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-3">
          <Label>Tema del Chatbot</Label>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer transition-all ${
                businessData.visualConfig.theme === "light"
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : "hover:border-gray-300"
              }`}
              onClick={() => handleThemeChange("light")}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="w-full h-8 bg-white border rounded flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-900">
                      Claro
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Fondo blanco, texto oscuro
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                businessData.visualConfig.theme === "dark"
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : "hover:border-gray-300"
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="w-full h-8 bg-gray-900 border rounded flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      Oscuro
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Fondo oscuro, texto claro
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-2">
          <Label htmlFor="welcomeMessage">Mensaje de Bienvenida</Label>
          <Textarea
            id="welcomeMessage"
            value={businessData.visualConfig.welcomeMessage}
            onChange={(e) =>
              setBusinessData({
                ...businessData,
                visualConfig: {
                  ...businessData.visualConfig,
                  welcomeMessage: e.target.value,
                },
              })
            }
            rows={3}
            placeholder="¡Hola! Bienvenido a nuestro negocio. ¿En qué puedo ayudarte hoy?"
          />
          <p className="text-sm text-gray-500">
            Este mensaje aparecerá cuando los clientes inicien una conversación
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={() => window.history.back()}>
          Atrás
        </Button>
        <Button onClick={onNext} className="px-8">
          Siguiente
        </Button>
      </div>
    </div>
  );
}
