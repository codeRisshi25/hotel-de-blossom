import { bearerToken, errorResponse, requestId } from "./http";
import { getAuthUser, getStaffProfile } from "./supabase-rest";
import type { Env } from "./types";

export const requireStaff = async (request: Request, env: Env) => {
  const id = requestId(request);
  const token = bearerToken(request);
  if (!token) return { response: errorResponse(401, "UNAUTHENTICATED", "Sign-in is required.", id) };

  const user = await getAuthUser(env, token);
  if (!user) return { response: errorResponse(401, "INVALID_SESSION", "Your session is invalid or expired.", id) };

  const profile = await getStaffProfile(env, user.id);
  if (!profile) return { response: errorResponse(403, "STAFF_ACCESS_REQUIRED", "Staff access is required.", id) };

  return { userId: user.id, profile };
};
