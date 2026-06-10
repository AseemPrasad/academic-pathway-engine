import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const sort = searchParams.get("sort") ?? "created_at";
    const order = searchParams.get("order") === "asc" ? true : false;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("submissions")
      .select("*", { count: "exact" })
      .order(sort, { ascending: order })
      .range(from, to);

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,recommendation.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ message: "Failed to fetch submissions." }, { status: 500 });
    }

    return NextResponse.json({ data, total: count ?? 0 }, { status: 200 });
  } catch (err) {
    console.error("Submissions route error:", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
