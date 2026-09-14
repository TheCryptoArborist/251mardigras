import { NextResponse } from "next/server";

const CITY_ROUTE_MAP_ITEMS: Record<string, string> = {
  a: "3482a62f130040138c7d0cdc21e1607b",
  b: "124f95240da640e38439f1682bf21f22",
  c: "bb83c5525849406898e48a15182ef747",
  d: "a30125a0882c4e72a14609f3f766a303",
  e: "e1f05fce9a4b417cb8e8692c6f352604",
  f: "33b04ccc972a4db98a33b4cc74a29212",
  g: "c62292635da0426b8df80dd5cb86fe84",
  h: "31f62f9dd54641abac517a299d1d0934"
};

type RouteMapRequestProps = {
  params: Promise<{ route: string }>;
};

export async function GET(_request: Request, { params }: RouteMapRequestProps) {
  const { route } = await params;
  const routeKey = route.toLowerCase();
  const itemId = CITY_ROUTE_MAP_ITEMS[routeKey];

  if (!itemId) {
    return NextResponse.json({ error: "Route map not found" }, { status: 404 });
  }

  const response = await fetch(`https://www.arcgis.com/sharing/rest/content/items/${itemId}/data`, {
    next: { revalidate: 86400 }
  });

  if (!response.ok) {
    return NextResponse.json({ error: "City route map is temporarily unavailable" }, { status: 502 });
  }

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/pdf",
      "Content-Disposition": `inline; filename=mobile-mardi-gras-route-${routeKey.toUpperCase()}.pdf`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
