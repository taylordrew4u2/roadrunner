// Simple app-gate based on a shared password hash in env.
// Never store cleartext secrets in the client.

export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function checkAppPassword(pass: string): Promise<boolean> {
  const expected = process.env.NEXT_PUBLIC_APP_PASS_HASH;
  if (!expected) return true; // if not set, allow access
  const got = await sha256(pass);
  return got === expected;
}
