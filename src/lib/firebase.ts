const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function ensureAnonymousAuth(): Promise<string> {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem("userId", userId);
  }
  return userId;
}

export async function onAuthReady(): Promise<string> {
  return ensureAnonymousAuth();
}

export function getCurrentUserId(): string {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem("userId", userId);
  }
  return userId;
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const apiClient = {
  request: async (path: string, options: RequestInit = {}) => {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": userId,
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },
};
