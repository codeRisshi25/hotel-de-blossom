import { bearerToken, errorResponse, requestId } from "./http";
import { getAuthUser, getStaffProfile } from "./supabase-rest";
import type { Env, StaffRole } from "./types";

type StaffAuth = { response: Response } | { userId: string; profile: { user_id: string; display_name: string; role: StaffRole; is_active: boolean } };

export const requireStaff = async (request: Request, env: Env): Promise<StaffAuth> => {
  const id = requestId(request);
  const token = bearerToken(request);
  if (!token) return { response: errorResponse(401, "UNAUTHENTICATED", "Sign-in is required.", id) };

  try {
    const user = await getAuthUser(env, token);
    if (!user) return { response: errorResponse(401, "INVALID_SESSION", "Your session is invalid or expired.", id) };

    const profile = await getStaffProfile(env, user.id);
    if (!profile) return { response: errorResponse(403, "STAFF_ACCESS_REQUIRED", "This account is not an active staff account.", id) };

    return { userId: user.id, profile };
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return { response: errorResponse(503, "AUTH_UNAVAILABLE", "Sign-in could not be verified. Please try again.", id) };
  }
};
