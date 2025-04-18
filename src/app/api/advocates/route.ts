import { NextResponse } from "next/server";
import db from "@/db";
import { advocates } from "@/db/schema";
import { or, eq, ilike, sql, asc, desc } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

type Advocate = InferSelectModel<typeof advocates>;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = (url.searchParams.get("search") ?? "").trim();
  const skip = parseInt(url.searchParams.get("skip") ?? "0", 10);
  const takeRaw = parseInt(url.searchParams.get("take") ?? "50", 10);
  const sortBy = url.searchParams.get("sortBy") || "id";
  const sortOrder =
    url.searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

  const take = Math.min(Math.max(takeRaw, 1), 100);

  let whereClause: ReturnType<typeof or> | undefined;

  if (search) {
    const term = `%${search}%`;
    const arrayMatch = sql<boolean>`
      array_to_string(${advocates.specialties}, ',') ILIKE ${term}
    `;
    whereClause = or(
      ilike(advocates.firstName, term),
      ilike(advocates.lastName, term),
      ilike(advocates.city, term),
      ilike(advocates.degree, term),
      arrayMatch,
      eq(advocates.yearsOfExperience, Number(search) || -1),
    );
  }

  // Map the incoming sortBy to real columns or expressions
  const columnMap: Record<string, any> = {
    id: advocates.id,
    firstName: advocates.firstName,
    lastName: advocates.lastName,
    city: advocates.city,
    degree: advocates.degree,
    specialties: sql`array_to_string(${advocates.specialties}, ',')`,
    yearsOfExperience: advocates.yearsOfExperience,
    phoneNumber: advocates.phoneNumber,
  };
  const sortColumn = columnMap[sortBy] ?? advocates.id;
  const orderFunc = sortOrder === "asc" ? asc : desc;

  // Fetch data
  const dataQuery = db
    .select()
    .from(advocates)
    .limit(take)
    .offset(skip)
    .orderBy(orderFunc(sortColumn));

  if (whereClause) {
    dataQuery.where(whereClause);
  }

  const data: Advocate[] = await dataQuery;

  // Fetch total count
  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(advocates);

  if (whereClause) {
    countQuery.where(whereClause);
  }
  const [{ count }] = await countQuery;
  const total = Number(count);

  return NextResponse.json({ data, total, skip, take });
}
