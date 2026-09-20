import { NextResponse } from "next/server";
import { getCompositions, getGroupById, getMemberById, getMembers, getTopic } from "@/lib/repository";
import { getSession } from "@/lib/session";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params;
    const session = getSession(groupId);
    const group = await getGroupById(groupId);
    if (!group) {
      return NextResponse.json({ error: "Grup bulunamadi" }, { status: 404 });
    }
    const members = await getMembers(groupId);
    const topic = await getTopic(groupId);
    const compositions = await getCompositions(groupId);

    let viewerRole: "admin" | "member" | null = null;
    let viewerMemberId: string | null = null;

    if (session) {
      const me = await getMemberById(session.memberId);
      if (me && me.group_id === groupId) {
        viewerRole = me.role;
        viewerMemberId = me.id;
      }
    }

    if (!viewerRole) {
      return NextResponse.json(
        {
          group: { id: group.id, name: group.name, invite_code: null },
          members: members.map((m) => ({ id: m.id, name: m.name, role: m.role })),
          topic: topic ? { id: topic.id, title: topic.title } : null,
          compositions: [],
          viewer: null,
        },
        { status: 200 }
      );
    }

    let filteredComps = compositions;
    if (viewerRole === "member") {
      filteredComps = compositions.filter((c) => c.member_id === viewerMemberId);
    }

    return NextResponse.json({
      group: {
        id: group.id,
        name: group.name,
        invite_code: viewerRole === "admin" ? group.invite_code : null,
      },
      members: members.map((m) => ({
        id: m.id,
        name: m.name,
        email: viewerRole === "admin" ? m.email : (m.id === viewerMemberId ? m.email : null),
        role: m.role,
        joined_at: m.joined_at,
      })),
      topic: topic ? { id: topic.id, title: topic.title, updated_at: topic.updated_at } : null,
      compositions: filteredComps.map((c) => ({
        id: c.id,
        member_id: c.member_id,
        topic_id: c.topic_id,
        content: c.content,
        updated_at: c.updated_at,
      })),
      viewer: {
        member_id: viewerMemberId,
        role: viewerRole,
      },
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Veri cekilemedi" },
      { status: 500 }
    );
  }
}
