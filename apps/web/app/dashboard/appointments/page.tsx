"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

export default function AppointmentsPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusiness) {
      loadAppointments(selectedBusiness);
    }
  }, [selectedBusiness]);

  const loadBusinesses = async () => {
    try {
      const { businesses } = await apiClient.getBusinesses();
      setBusinesses(businesses);
      if (businesses.length > 0) {
        setSelectedBusiness(businesses[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAppointments = async (businessId: number) => {
    try {
      const { appointments } = await apiClient.getAppointments(businessId);
      setAppointments(appointments);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async (appointmentId: number) => {
    if (!selectedBusiness) return;
    try {
      await apiClient.confirmAppointment(selectedBusiness, appointmentId);
      loadAppointments(selectedBusiness);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    if (!selectedBusiness) return;
    try {
      await apiClient.cancelAppointment(selectedBusiness, appointmentId);
      loadAppointments(selectedBusiness);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          No tienes negocios creados
        </h2>
        <p className="text-gray-600">
          Crea un negocio primero para gestionar citas
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Citas</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Negocio
        </label>
        <select
          value={selectedBusiness || ""}
          onChange={(e) => setSelectedBusiness(parseInt(e.target.value))}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg"
        >
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No hay citas para este negocio
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.customerData.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.customerData.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(appointment.appointmentTime).toLocaleString("es-ES")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleConfirm(appointment.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

