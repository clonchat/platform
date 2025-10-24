"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function CreateBusinessPage() {
  const router = useRouter();

  const handleCreateBusiness = () => {
    // Redirect to onboarding wizard for additional businesses
    router.push("/onboarding");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Crear Nuevo Negocio
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Configurar Nuevo Negocio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Configura tu nuevo negocio
            </h3>
            <p className="text-gray-600 mb-6">
              Usa nuestro asistente paso a paso para configurar todos los
              detalles de tu nuevo negocio de forma rápida y fácil.
            </p>
            <Button onClick={handleCreateBusiness} className="px-8">
              Comenzar Configuración
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
