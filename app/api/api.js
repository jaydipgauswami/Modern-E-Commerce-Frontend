
export  const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  // token nahi hai
  if (!token) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  // expired / invalid token
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }

  //  agar response me body hi na ho (rare case)
  let data = null;
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};