import { NextResponse } from "next/server";
import { checkAllSources } from "@/services/source-checker";

export async function POST() {
  try {
    const results = await checkAllSources();

    return NextResponse.json({
      ok: true,
      checked: results.length,
      results
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown source check error"
      },
      { status: 500 }
    );
  }
}

