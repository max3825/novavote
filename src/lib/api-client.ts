"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface ApiError {
  detail: string | Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export interface ElectionQuestion {
  question: string;
  options: string[];
  type?: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  status: "draft" | "open" | "closed" | "tallied";
  questions: ElectionQuestion[];
  start_date: string;
  end_date: string;
  created_at: string;
  public_key?: Record<string, unknown> | string;
}

export interface ElectionStats {
  votes_received: number;
  voters_invited: number;
  participation_rate: number;
}

export interface VoteSession {
  election_id: string;
  election_title: string;
  email: string;
  questions: ElectionQuestion[];
  public_key: Record<string, unknown> | string;
}

export interface SubmitBallotResponse {
  tracking_code: string;
}

interface AuthResponse {
  access_token: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
      // Stocker aussi dans les cookies pour le middleware
      document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      // Déclencher un événement pour notifier les autres composants
      window.dispatchEvent(new Event('auth-change'));
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      // Supprimer aussi le cookie avec date d'expiration explicite
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      // Déclencher un événement pour notifier les autres composants
      window.dispatchEvent(new Event('auth-change'));
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "API request failed";
      try {
        const error: ApiError = await response.json();
        if (typeof error.detail === "string") {
          errorMessage = error.detail;
        } else if (Array.isArray(error.detail)) {
          // Format validation errors from Pydantic
          errorMessage = error.detail
            .map((err) => `${err.loc.join(".")}: ${err.msg}`)
            .join(", ");
        } else {
          errorMessage = JSON.stringify(error.detail);
        }
      } catch {
        // Si ce n'est pas du JSON, utiliser le statusText
        errorMessage = response.statusText || `Error ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string) {
    // Utiliser la route API Next.js pour que le cookie soit défini côté serveur
    // (accessible au middleware)
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorMessage = "Login failed";
      try {
        const error: ApiError = await response.json();
        errorMessage =
          typeof error.detail === "string"
            ? error.detail
            : error.detail.toString();
      } catch {}
      throw new Error(errorMessage);
    }

    const data = await response.json() as AuthResponse;
    this.setToken(data.access_token);
    return data;
  }

  logout() {
    this.clearToken();
  }

  // Elections endpoints
  async createElection(electionData: unknown) {
    return this.request("/elections/", {
      method: "POST",
      body: JSON.stringify(electionData),
    });
  }

  async getElections() {
    return this.request<Election[]>("/elections/");
  }

  async getElection(id: string) {
    return this.request<Election>(`/elections/${id}`);
  }

  async updateElectionStatus(id: string, status: string) {
    return this.request(`/elections/${id}/status?new_status=${status}`, {
      method: "PATCH",
    });
  }

  async getElectionStats(id: string) {
    return this.request<ElectionStats>(`/elections/${id}/stats`);
  }

  async deleteElection(id: string) {
    return this.request(`/elections/${id}`, {
      method: "DELETE",
    });
  }

  // Ballots endpoints
  async submitBallot(ballotData: unknown) {
    return this.request<SubmitBallotResponse>("/ballots/", {
      method: "POST",
      body: JSON.stringify(ballotData),
    });
  }

  async verifyBallot(trackingCode: string) {
    return this.request(`/ballots/verify/${trackingCode}`);
  }

  // Magic Links endpoints
  async sendMagicLink(electionId: string, email: string) {
    return this.request("/magic-links/generate", {
      method: "POST",
      body: JSON.stringify({ election_id: electionId, email }),
    });
  }

  async verifyMagicLink(token: string) {
    return this.request<VoteSession>(`/magic-links/verify/${token}`);
  }
}

export const apiClient = new ApiClient(API_URL);
