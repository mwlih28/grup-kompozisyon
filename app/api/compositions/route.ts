import { NextResponse } from "next/server";
import {
  addOrGetMember,
  getCompositions,
  getGroupById,
  getMemberById,
  getMembers,
  upsertComposition,
  upsertTopic,
} from "@/lib/repository";
import { getSession } from "@/lib/session";
import { generateWithLLM, pickMockCompositions } from "@/lib/mock-compositions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const groupId = (body.groupId || "").toString().trim();
    const topicText = (body.topicText || "").toString().trim();

    if (!groupId) {
      return NextResponse.json({ error: "Grup id gerekli" }, { status: 400 });
    }
    if (topicText.length < 3) {
      return NextResponse.json({ error: "Konu en az 3 karakter olmalidir" }, { status: 400 });
    }

    const group = await getGroupById(groupId);
    if (!group) {
      return NextResponse.json({ error: "Grup bulunamadi" }, { status: 404 });
    }
    const session = getSession(groupId);
    if (!session) {
      return NextResponse.json({ error: "Oturum bulunamadi" }, { status: 401 });
    }
    const me = await getMemberById(session.memberId);
    if (!me || me.group_id !== groupId || me.role !== "admin") {
      return NextResponse.json({ error: "Bu islem icin yonetici olmalisiniz" }, { status: 403 });
    }

    const topic = await upsertTopic(groupId, topicText);
    const members = await getMembers(groupId);
    if (members.length === 0) {
      return NextResponse.json({ error: "Grupta uye yok" }, { status: 400 });
    }

    const useLLM = !!(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY);
    const contents: string[] = useLLM
      ? await Promise.all(
          members.map((m) =>
            generateWithLLM(
              topicText,
              m.name,
              members.filter((x) => x.id !== m.id).map((x) => x.name)
            )
          )
        )
      : pickMockCompositions(
          members.length,
          topicText,
          members.map((m) => m.name)
        );

    for (let i = 0; i < members.length; i++) {
      await upsertComposition({
        group_id: groupId,
        member_id: members[i].id,
        topic_id: topic.id,
        content: contents[i],
      });
    }

    return NextResponse.json({
      generatedCount: members.length,
      memberIds: members.map((m) => m.id),
      topicId: topic.id,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Kompozisyonlar uretilirken hata" },
      { status: 500 }
    );
  }
}
