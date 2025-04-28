import db from "../../../db";
import { advocates } from "@/db/schema";
import { advocateData } from "@/db/seed/advocates";

export async function POST() {
  // Convert phones to strings for safer storage and manipulation
  const dataWithStringPhones = advocateData.map((adv) => ({
    ...adv,
    phoneNumber: String(adv.phoneNumber),
  }));

  const records = await db
    .insert(advocates)
    .values(dataWithStringPhones)
    .returning();

  return Response.json({ advocates: records });
}
