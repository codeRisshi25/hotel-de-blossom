import { errorResponse, json, requestId } from "../../../src/server/http";
import { requireStaff } from "../../../src/server/staff-auth";
import { summary } from "../../../src/server/supabase-rest";
import type { Env } from "../../../src/server/types";
export const onRequestGet = async ({request,env}:{request:Request;env:Env}) => { const id=requestId(request); const auth=await requireStaff(request,env); if("response" in auth)return auth.response; try{return json({data:await summary(env)},200,{"x-request-id":id});}catch{return errorResponse(503,"SUMMARY_UNAVAILABLE","Dashboard summary is temporarily unavailable.",id);} };
