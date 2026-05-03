import { apiRequest } from "./api";

export type AuthRole = "USER" | "LANDLORD" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: AuthRole;
  status: "ACTIVE" | "BANNED";
  createdAt?: string;
};

type AuthPayload = {
  user: AuthUser;
  accessToken: string;
};

type AuthEnvelope = {
  data: AuthPayload;
  message?: string;
};

type MeEnvelope = {
  data: AuthUser;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: Exclude<AuthRole, "ADMIN">;
};

export type LoginInput = {
  identifier: string;
  password: string;
};

export async function registerUser(input: RegisterInput) {
  const response = await apiRequest<AuthEnvelope>("/auth/register", {
    method: "POST",
    body: input,
  });

  return response.data;
}

export async function loginUser(input: LoginInput) {
  const response = await apiRequest<AuthEnvelope>("/auth/login", {
    method: "POST",
    body: input,
  });

  return response.data;
}

export async function refreshToken() {
  const response = await apiRequest<AuthEnvelope>("/auth/refresh", {
    method: "POST",
    body: {},
  });

  return response.data;
}

export async function getMe(accessToken: string) {
  const response = await apiRequest<MeEnvelope>("/auth/me", {
    method: "GET",
    token: accessToken,
  });

  return response.data;
}

export async function logoutUser(accessToken: string) {
  await apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
    token: accessToken,
    body: {},
  });
}
