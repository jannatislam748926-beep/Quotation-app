export async function submitQuotation(quoteData) {
  const response = await fetch("/api/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quoteData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit quotation request.");
  }

  return data;
}