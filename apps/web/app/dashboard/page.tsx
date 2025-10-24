"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loading } from "@/components/ui/loading";

export default function DashboardPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const { businesses } = await apiClient.getBusinesses();
      setBusinesses(businesses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading variant="spinner" size="lg" text="Cargando tus negocios..." />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Negocios</h1>
        <Button asChild>
          <Link href="/dashboard/create-business">Crear Nuevo Negocio</Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {businesses.length === 0 ? (
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              No tienes negocios aún
            </CardTitle>
            <CardDescription className="text-gray-600">
              Crea tu primer negocio para comenzar a gestionar citas y pedidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/create-business">
                Crear Mi Primer Negocio
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card
              key={business.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {business.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {business.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">Subdominio:</span>{" "}
                  {business.subdomain}.clonchat.com
                </div>
              </CardContent>
              <CardFooter className="flex space-x-2">
                <Button asChild className="flex-1">
                  <Link href={`/dashboard/business/${business.id}`}>Ver</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/dashboard/business/${business.id}/edit`}>
                    Editar
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
