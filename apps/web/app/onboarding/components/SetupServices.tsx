"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

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

interface SetupServicesProps {
  businessData: BusinessData;
  setBusinessData: (data: BusinessData) => void;
  onBack: () => void;
  onNext: () => void;
}

interface ServiceFormData {
  name: string;
  duration: number;
  price: number;
}

export default function SetupServices({
  businessData,
  setBusinessData,
  onBack,
  onNext,
}: SetupServicesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    name: "",
    duration: 60,
    price: 0,
  });

  const openAddDialog = () => {
    setServiceForm({ name: "", duration: 60, price: 0 });
    setEditingService(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (serviceId: string) => {
    const service = businessData.appointmentConfig.services.find(
      (s) => s.id === serviceId
    );
    if (service) {
      setServiceForm({
        name: service.name,
        duration: service.duration,
        price: service.price || 0,
      });
      setEditingService(serviceId);
      setIsDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    setServiceForm({ name: "", duration: 60, price: 0 });
  };

  const handleSaveService = () => {
    if (!serviceForm.name.trim()) return;

    const newService = {
      id: editingService || crypto.randomUUID(),
      name: serviceForm.name.trim(),
      duration: serviceForm.duration,
      price: serviceForm.price || undefined,
    };

    let updatedServices;
    if (editingService) {
      // Edit existing service
      updatedServices = businessData.appointmentConfig.services.map((s) =>
        s.id === editingService ? newService : s
      );
    } else {
      // Add new service
      updatedServices = [
        ...businessData.appointmentConfig.services,
        newService,
      ];
    }

    setBusinessData({
      ...businessData,
      appointmentConfig: {
        ...businessData.appointmentConfig,
        services: updatedServices,
      },
    });

    closeDialog();
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = businessData.appointmentConfig.services.filter(
      (s) => s.id !== serviceId
    );
    setBusinessData({
      ...businessData,
      appointmentConfig: {
        ...businessData.appointmentConfig,
        services: updatedServices,
      },
    });
  };

  const isFormValid = businessData.appointmentConfig.services.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Servicios</h2>
        <p className="text-gray-600">
          Define los servicios que ofreces a tus clientes
        </p>
      </div>

      <div className="space-y-4">
        {/* Services List */}
        {businessData.appointmentConfig.services.length > 0 ? (
          <div className="grid gap-4">
            {businessData.appointmentConfig.services.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {service.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{service.duration} minutos</span>
                        {service.price && service.price > 0 && (
                          <span>${service.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(service.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay servicios configurados</p>
            <p className="text-sm">
              Agrega al menos un servicio para continuar
            </p>
          </div>
        )}

        {/* Add Service Button */}
        <Button variant="outline" onClick={openAddDialog} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Servicio
        </Button>
      </div>

      {/* Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar Servicio" : "Agregar Servicio"}
            </DialogTitle>
            <DialogDescription>
              Configura los detalles del servicio
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Nombre del Servicio *</Label>
              <Input
                id="service-name"
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, name: e.target.value })
                }
                placeholder="Consulta General"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-duration">Duración (minutos) *</Label>
                <Input
                  id="service-duration"
                  type="number"
                  value={serviceForm.duration}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      duration: parseInt(e.target.value) || 0,
                    })
                  }
                  min="15"
                  max="480"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-price">Precio (opcional)</Label>
                <Input
                  id="service-price"
                  type="number"
                  value={serviceForm.price}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveService}
              disabled={!serviceForm.name.trim()}
            >
              {editingService ? "Actualizar" : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={onNext} disabled={!isFormValid} className="px-8">
          Siguiente
        </Button>
      </div>
    </div>
  );
}
