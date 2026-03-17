import type { DetectRequest, DetectResponse, ConvertRequest, ConvertResponse } from "@/types"

const API_URL = import.meta.env.VITE_API_URL ?? "/api"

export async function detectDelimiter(request: DetectRequest): Promise<DetectResponse> {
  const res = await fetch(`${API_URL}/delimiter/detect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(`Detect failed: ${res.statusText}`)
  return res.json()
}

export async function convertDelimiter(request: ConvertRequest): Promise<ConvertResponse> {
  const res = await fetch(`${API_URL}/delimiter/convert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(`Convert failed: ${res.statusText}`)
  return res.json()
}
