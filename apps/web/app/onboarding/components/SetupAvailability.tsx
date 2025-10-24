"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";

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

interface SetupAvailabilityProps {
  businessData: BusinessData;
  setBusinessData: (data: BusinessData) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const DAYS = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
] as const;

export default function SetupAvailability({
  businessData,
  setBusinessData,
  onBack,
  onSubmit,
  isLoading,
}: SetupAvailabilityProps) {
  const [newSlot, setNewSlot] = useState({ start: "09:00", end: "17:00" });

  const getDayAvailability = (day: string) => {
    return (
      businessData.availability.find((a) => a.day === day) || {
        day: day as any,
        slots: [],
      }
    );
  };

  const toggleDay = (day: string) => {
    const existing = businessData.availability.find((a) => a.day === day);

    if (existing) {
      // Remove day
      setBusinessData({
        ...businessData,
        availability: businessData.availability.filter((a) => a.day !== day),
      });
    } else {
      // Add day with default slot
      setBusinessData({
        ...businessData,
        availability: [
          ...businessData.availability,
          {
            day: day as any,
            slots: [{ start: "09:00", end: "17:00" }],
          },
        ],
      });
    }
  };

  const addSlot = (day: string) => {
    const dayAvailability = getDayAvailability(day);
    const updatedAvailability = businessData.availability.filter(
      (a) => a.day !== day
    );

    updatedAvailability.push({
      day: day as any,
      slots: [...dayAvailability.slots, { ...newSlot }],
    });

    setBusinessData({
      ...businessData,
      availability: updatedAvailability,
    });
  };

  const removeSlot = (day: string, slotIndex: number) => {
    const dayAvailability = getDayAvailability(day);
    const updatedSlots = dayAvailability.slots.filter(
      (_, index) => index !== slotIndex
    );

    const updatedAvailability = businessData.availability.filter(
      (a) => a.day !== day
    );

    if (updatedSlots.length > 0) {
      updatedAvailability.push({
        day: day as any,
        slots: updatedSlots,
      });
    }

    setBusinessData({
      ...businessData,
      availability: updatedAvailability,
    });
  };

  const updateSlot = (
    day: string,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    const dayAvailability = getDayAvailability(day);
    const updatedSlots = dayAvailability.slots.map((slot, index) =>
      index === slotIndex ? { ...slot, [field]: value } : slot
    );

    const updatedAvailability = businessData.availability.filter(
      (a) => a.day !== day
    );
    updatedAvailability.push({
      day: day as any,
      slots: updatedSlots,
    });

    setBusinessData({
      ...businessData,
      availability: updatedAvailability,
    });
  };

  const isDayEnabled = (day: string) => {
    return businessData.availability.some((a) => a.day === day);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Horarios de Atención
        </h2>
        <p className="text-gray-600">
          Configura los días y horarios en los que estás disponible
        </p>
      </div>

      <div className="space-y-6">
        {DAYS.map(({ key, label }) => {
          const dayAvailability = getDayAvailability(key);
          const isEnabled = isDayEnabled(key);

          return (
            <Card key={key}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{label}</CardTitle>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleDay(key)}
                  />
                </div>
              </CardHeader>

              {isEnabled && (
                <CardContent className="space-y-4">
                  {/* Existing Slots */}
                  {dayAvailability.slots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`${key}-start-${slotIndex}`}>
                          Desde:
                        </Label>
                        <Input
                          id={`${key}-start-${slotIndex}`}
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            updateSlot(key, slotIndex, "start", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`${key}-end-${slotIndex}`}>
                          Hasta:
                        </Label>
                        <Input
                          id={`${key}-end-${slotIndex}`}
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            updateSlot(key, slotIndex, "end", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSlot(key, slotIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Add New Slot */}
                  <div className="flex items-center space-x-4 pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Label>Desde:</Label>
                      <Input
                        type="time"
                        value={newSlot.start}
                        onChange={(e) =>
                          setNewSlot({ ...newSlot, start: e.target.value })
                        }
                        className="w-32"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Label>Hasta:</Label>
                      <Input
                        type="time"
                        value={newSlot.end}
                        onChange={(e) =>
                          setNewSlot({ ...newSlot, end: e.target.value })
                        }
                        className="w-32"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addSlot(key)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={onSubmit} disabled={isLoading} className="px-8">
          {isLoading ? "Creando..." : "Crear mi Chatbot"}
        </Button>
      </div>
    </div>
  );
}
