import { apiRequest } from "./api";
import type { AuthUser } from "./auth";

export async function updateCurrentUser(
  payload: {
    fullName?: string;
    phone?: string;
  },
  accessToken: string,
) {
  const response = await apiRequest<{ data: AuthUser }>("/users/me", {
    method: "PUT",
    token: accessToken,
    body: payload,
  });

  return response.data;
}
