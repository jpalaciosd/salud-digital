import { NextRequest, NextResponse } from "next/server";
import { searchCIE10 } from "@/lib/cie10-catalogo";

// GET /api/clinico/cie10?q=gastritis&limit=10
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");
  const results = searchCIE10(q, limit);
  return NextResponse.json({ results });
}
