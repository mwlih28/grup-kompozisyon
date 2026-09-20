import { NextResponse } from "next/server";
import { createGroup } from "@/lib/repository";
import { setSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || "").toString().trim();
    const adminName = (body.adminName || "").toString().trim();
    const adminEmail = (body.adminEmail || "").toString().trim().toLowerCase();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Grup adi en az 2 karakter olmalidir." }, { status: 400 });
    }
    if (!adminName || adminName.length < 2) {
      return NextResponse.json({ error: "Yonetici adi en az 2 karakter olmalidir." }, { status: 400 });
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!adminEmail || !emailRe.test(adminEmail)) {
      return NextResponse.json({ error: "Gecerli bir e-posta giriniz." }, { status: 400 });
    }

    const { group, member } = await createGroup({
      name,
      adminName,
      adminEmail,
    });

    setSession({ memberId: member.id, groupId: group.id });

    return NextResponse.json({
      groupId: group.id,
      inviteCode: group.invite_code,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Grup olusturulurken bir hata olustu." },
      { status: 500 }
    );
  }
}
