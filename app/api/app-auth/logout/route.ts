import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAppAccessCookieName } from "@/lib/app-auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(getAppAccessCookieName());
  return NextResponse.json({ loggedOut: true });
}
