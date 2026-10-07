export const json = (body: unknown, status = 200, extraHeaders: HeadersInit = {}) => {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    ...extraHeaders,
  });
  return new Response(JSON.stringify(body), { status, headers });
};

export const errorResponse = (status: number, code: string, message: string, requestId: string) =>
  json({ error: { code, message, requestId } }, status, { "x-request-id": requestId });

export const requestId = (request: Request) =>
  request.headers.get("cf-ray") ?? crypto.randomUUID();

export const bodyTooLarge = (request: Request, maxBytes = 16_384) => {
  const length = Number(request.headers.get("content-length") ?? 0);
  return Number.isFinite(length) && length > maxBytes;
};

export class BodyTooLargeError extends Error {}

export const readJson = async (request: Request, maxBytes = 16_384): Promise<unknown> => {
  if (bodyTooLarge(request, maxBytes)) throw new BodyTooLargeError("Request body is too large.");
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > maxBytes) throw new BodyTooLargeError("Request body is too large.");
  return JSON.parse(new TextDecoder().decode(bytes));
};

export const bearerToken = (request: Request) => {
  const value = request.headers.get("authorization") ?? "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : null;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (value: unknown): value is string => typeof value === "string" && uuidPattern.test(value);

/** Route param as a single string, whether the router handed us a string or an array. */
export const routeParam = (params: Record<string, string | string[]>, name: string) => {
  const value = params[name];
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
};

/** Parses a JSON body that must be an object; `null`, arrays and scalars are rejected as invalid JSON. */
export const readJsonObject = async (request: Request, maxBytes = 16_384): Promise<Record<string, unknown>> => {
  const body = await readJson(request, maxBytes);
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new SyntaxError("Expected a JSON object.");
  return body as Record<string, unknown>;
};
