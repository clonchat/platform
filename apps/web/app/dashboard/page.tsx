"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import Link from "next/link";

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
    return <div>Cargando negocios...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Negocios</h1>
        <Link
          href="/dashboard/create-business"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Crear Nuevo Negocio
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {businesses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            No tienes negocios aún
          </h2>
          <p className="text-gray-600 mb-6">
            Crea tu primer negocio para comenzar a gestionar citas y pedidos
          </p>
          <Link
            href="/dashboard/create-business"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Crear Mi Primer Negocio
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {business.name}
              </h3>
              <p className="text-gray-600 mb-4">{business.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                <span className="font-medium">Subdominio:</span>{" "}
                {business.subdomain}.clonchat.com
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/dashboard/business/${business.id}`}
                  className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Ver
                </Link>
                <Link
                  href={`/dashboard/business/${business.id}/edit`}
                  className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

