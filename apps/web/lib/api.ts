import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;

    // Mantener compatibilidad con token legacy
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Intentar obtener el token de NextAuth primero
    try {
      const session = await getSession();
      if (session?.user) {
        // Enviar la información del usuario directamente en el header
        // El backend puede usar esta información para autenticar
        headers["X-User-Id"] = session.user.id;
        headers["X-User-Email"] = session.user.email;
      }
    } catch (e) {
      // Si falla, intentar con token legacy
      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "An error occurred",
      }));
      throw new Error(error.error || `HTTP error ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, name?: string) {
    return this.request<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request<{ user: any }>("/auth/me");
  }

  // Business endpoints
  async getBusinesses() {
    return this.request<{ businesses: any[] }>("/businesses");
  }

  async createBusiness(data: any) {
    return this.request<{ business: any }>("/businesses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBusiness(id: number, data: any) {
    return this.request<{ business: any }>(`/businesses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBusiness(id: number) {
    return this.request<{ message: string }>(`/businesses/${id}`, {
      method: "DELETE",
    });
  }

  async getBusinessBySubdomain(subdomain: string) {
    return this.request<{ business: any }>(
      `/businesses/subdomain/${subdomain}`
    );
  }

  async checkSubdomainAvailability(subdomain: string) {
    return this.request<{ available: boolean }>(
      `/businesses/check-subdomain/${subdomain}`
    );
  }

  // Email verification endpoints
  async verifyEmail(token: string) {
    return this.request<{ message: string; user: any }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(email: string) {
    return this.request<{ message: string }>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // User status endpoint
  async getUserStatus() {
    return this.request<{
      hasCompletedOnboarding: boolean;
      emailVerified: boolean;
    }>("/user/status");
  }

  // Appointment endpoints
  async getAppointments(businessId: number) {
    return this.request<{ appointments: any[] }>(`/appointments/${businessId}`);
  }

  async createAppointment(data: any) {
    return this.request<{ appointment: any }>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async confirmAppointment(businessId: number, appointmentId: number) {
    return this.request<{ appointment: any }>(
      `/appointments/${businessId}/confirm`,
      {
        method: "POST",
        body: JSON.stringify({ appointmentId }),
      }
    );
  }

  async cancelAppointment(businessId: number, appointmentId: number) {
    return this.request<{ appointment: any }>(
      `/appointments/${businessId}/cancel`,
      {
        method: "POST",
        body: JSON.stringify({ appointmentId }),
      }
    );
  }

  // Chat endpoint
  async sendChatMessage(
    businessId: number,
    sessionId: string,
    message: string,
    conversationHistory?: any[]
  ) {
    return this.request<{
      botResponse: string;
      detectedIntent: string;
      entities: any;
    }>(`/chat/${businessId}/message`, {
      method: "POST",
      body: JSON.stringify({
        sessionId,
        message,
        conversationHistory,
      }),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
