function getCsrfToken(): string {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="));

  return cookie
    ? decodeURIComponent(cookie.split("=")[1])
    : "";
}

export async function createSignature(
  name: string,
  signature: string,
) {
  const response = await fetch("/api/signatures/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCsrfToken(),
    },
    body: JSON.stringify({
      name,
      signature,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create signature");
  }

  return response.json();
}