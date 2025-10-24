"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loading } from "@/components/ui/loading";
import SetupGeneralData from "./components/SetupGeneralData";
import SetupSpecificData from "./components/SetupSpecificData";
import SetupServices from "./components/SetupServices";
import SetupAvailability from "./components/SetupAvailability";

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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    description: "",
    subdomain: "",
    visualConfig: {
      theme: "light",
      welcomeMessage: "",
    },
    appointmentConfig: {
      services: [],
    },
    availability: [],
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      await apiClient.createBusiness(businessData);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al crear el negocio");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SetupGeneralData
            businessData={businessData}
            setBusinessData={setBusinessData}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <SetupSpecificData
            businessData={businessData}
            setBusinessData={setBusinessData}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        );
      case 3:
        return (
          <SetupServices
            businessData={businessData}
            setBusinessData={setBusinessData}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        );
      case 4:
        return (
          <SetupAvailability
            businessData={businessData}
            setBusinessData={setBusinessData}
            onBack={() => setStep(3)}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configura tu Chatbot
          </h1>
          <p className="text-gray-600">
            Paso {step} de 4 - Vamos a configurar tu primer negocio
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {renderStep()}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <Loading variant="dots" size="lg" />
              <span className="text-gray-700">Creando tu chatbot...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
