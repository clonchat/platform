"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

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

interface SetupGeneralDataProps {
  businessData: BusinessData;
  setBusinessData: (data: BusinessData) => void;
  onNext: () => void;
}

export default function SetupGeneralData({
  businessData,
  setBusinessData,
  onNext,
}: SetupGeneralDataProps) {
  const [subdomainStatus, setSubdomainStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [subdomainError, setSubdomainError] = useState("");

  // Debounced subdomain check
  useEffect(() => {
    if (!businessData.subdomain || businessData.subdomain.length < 3) {
      setSubdomainStatus("idle");
      setSubdomainError("");
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSubdomainStatus("checking");
      setSubdomainError("");

      try {
        const response = await apiClient.checkSubdomainAvailability(
          businessData.subdomain
        );
        setSubdomainStatus(response.available ? "available" : "taken");
        if (!response.available) {
          setSubdomainError("Este subdominio ya está en uso");
        }
      } catch (error) {
        setSubdomainStatus("taken");
        setSubdomainError("Error al verificar disponibilidad");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [businessData.subdomain]);

  const handleSubdomainChange = (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setBusinessData({
      ...businessData,
      subdomain: cleanValue,
    });
  };

  const isFormValid =
    businessData.name.trim() !== "" &&
    businessData.subdomain.trim() !== "" &&
    subdomainStatus === "available";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Información General
        </h2>
        <p className="text-gray-600">
          Comencemos con los datos básicos de tu negocio
        </p>
      </div>

      <div className="space-y-6">
        {/* Business Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Negocio *</Label>
          <Input
            id="name"
            type="text"
            value={businessData.name}
            onChange={(e) =>
              setBusinessData({ ...businessData, name: e.target.value })
            }
            placeholder="Mi Restaurante"
            required
          />
        </div>

        {/* Business Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={businessData.description}
            onChange={(e) =>
              setBusinessData({ ...businessData, description: e.target.value })
            }
            rows={3}
            placeholder="Describe brevemente tu negocio y los servicios que ofreces"
          />
        </div>

        {/* Subdomain */}
        <div className="space-y-2">
          <Label htmlFor="subdomain">Subdominio *</Label>
          <div className="flex items-center">
            <Input
              id="subdomain"
              type="text"
              value={businessData.subdomain}
              onChange={(e) => handleSubdomainChange(e.target.value)}
              placeholder="mi-negocio"
              required
              pattern="[a-z0-9-]+"
              className="rounded-r-none"
            />
            <span className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
              .clonchat.com
            </span>
          </div>

          {/* Subdomain Status Indicator */}
          {businessData.subdomain && (
            <div className="flex items-center space-x-2 text-sm">
              {subdomainStatus === "checking" && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-blue-600">
                    Verificando disponibilidad...
                  </span>
                </>
              )}
              {subdomainStatus === "available" && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Disponible</span>
                </>
              )}
              {subdomainStatus === "taken" && (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">{subdomainError}</span>
                </>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500">
            Solo letras minúsculas, números y guiones. Mínimo 3 caracteres.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t">
        <Button onClick={onNext} disabled={!isFormValid} className="px-8">
          Siguiente
        </Button>
      </div>
    </div>
  );
}
