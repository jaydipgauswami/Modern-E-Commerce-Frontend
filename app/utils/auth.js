// Decode JWT
export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

// Check if token expired
export function isTokenExpired(token) {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload) return true;
  const now = Date.now() / 1000; // current time in seconds
  return now > payload.exp;
}

// Refresh token
export async function refreshToken() {
  try {
    const res = await fetch("http://localhost:5000/api/auth/refresh-token", {
      method: "POST",
      credentials: "include", // agar refresh token cookie me hai
    });
    if (!res.ok) throw new Error("Refresh token failed");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    return data.token;
  } catch (err) {
    console.error("Refresh token error:", err);
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login
    return null;
  }
}