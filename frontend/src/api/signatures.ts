export async function createSignature(
  name: string,
  signature: string,
) {
  const response = await fetch("/api/signatures/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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