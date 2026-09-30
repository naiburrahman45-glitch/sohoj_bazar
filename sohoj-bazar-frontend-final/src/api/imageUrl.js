const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "").replace(/\/+$/, "");

export function imageUrl(value) {
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }
  return `${API_BASE}/${String(value).replace(/^\/+/, "")}`;
}
