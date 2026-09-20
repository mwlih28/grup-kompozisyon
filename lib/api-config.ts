const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function getApiUrl(path: string): string {
  if (!API_BASE_URL) return path;
  if (path.startsWith("/api/")) {
    return `${API_BASE_URL}${path}`;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabaseKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
