import { NextResponse } from "next/server";
import { getGroupByInviteCode } from "@/lib/repository";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const inviteCode = url.searchParams.get("inviteCode") || "";
  const group = await getGroupByInviteCode(inviteCode);
  if (!group) {
    return NextResponse.json({ error: "Gecersiz davet kodu" }, { status: 404 });
  }
  return NextResponse.json({ id: group.id, name: group.name });
}
