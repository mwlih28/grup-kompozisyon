import { NextResponse } from "next/server";
import { addOrGetMember, getGroupByInviteCode } from "@/lib/repository";
import { setSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inviteCode = (body.inviteCode || "").toString().trim();
    const name = (body.name || "").toString().trim();
    const email = (body.email || "").toString().trim().toLowerCase();

    if (!inviteCode) {
      return NextResponse.json({ error: "Davet kodu gerekli." }, { status: 400 });
    }
    if (name.length < 2) {
      return NextResponse.json({ error: "Adiniz en az 2 karakter olmalidir." }, { status: 400 });
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email)) {
      return NextResponse.json({ error: "Gecerli bir e-posta giriniz." }, { status: 400 });
    }

    const group = await getGroupByInviteCode(inviteCode);
    if (!group) {
      return NextResponse.json({ error: "Davet kodu gecersiz." }, { status: 404 });
    }

    const member = await addOrGetMember({
      groupId: group.id,
      name,
      email,
      role: "member",
    });

    setSession({ memberId: member.id, groupId: group.id });

    return NextResponse.json({
      groupId: group.id,
      memberId: member.id,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Katilim sirasinda bir hata olustu." },
      { status: 500 }
    );
  }
}
