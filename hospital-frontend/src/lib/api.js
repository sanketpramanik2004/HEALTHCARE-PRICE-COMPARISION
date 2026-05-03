const DEFAULT_ROOT_API_URL = "http://localhost:8080";

export const ROOT_API_URL = (process.env.REACT_APP_API_ROOT_URL || DEFAULT_ROOT_API_URL).replace(/\/+$/, "");
export const API_BASE_URL = `${ROOT_API_URL}/hospitals`;
export const AI_API_BASE_URL = `${ROOT_API_URL}/ai`;
export const REVIEW_API_BASE_URL = `${ROOT_API_URL}/reviews`;
export const USER_API_BASE_URL = `${ROOT_API_URL}/user`;
export const MEDICAL_HISTORY_API_BASE_URL = `${ROOT_API_URL}/medical-history`;
export const DOCTOR_API_BASE_URL = `${ROOT_API_URL}/doctors`;

export function buildHeaders(token, extra = {}) {
  const headers = { ...extra };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const rawText = await response.text();
  let payload = null;
  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || rawText || "Request failed.";
    throw new Error(message);
  }

  return payload;
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
