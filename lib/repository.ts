import { dbHasSupabase, mockDB, type Group, type Member, type Topic, type Composition } from "@/lib/db";
import { createClient as createServerClient } from "./supabase/server";

function hasSupabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key);
}

function genInviteCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

export async function createGroup(input: {
  name: string;
  adminName: string;
  adminEmail: string;
}): Promise<{ group: Group; member: Member }> {
  let inviteCode = genInviteCode();
  if (hasSupabase()) {
    const sb = createServerClient();
    if (sb) {
      let attempts = 0;
      while (attempts < 5) {
        const { data: existing } = await sb
          .from("groups")
          .select("id")
          .eq("invite_code", inviteCode)
          .maybeSingle();
        if (!existing) break;
        inviteCode = genInviteCode();
        attempts++;
      }
      const { data: gr, error: grErr } = await sb
        .from("groups")
        .insert({
          name: input.name,
          invite_code: inviteCode,
          created_by_email: input.adminEmail,
        })
        .select()
        .single();
      if (grErr || !gr) throw new Error("Grup olusturulamadi: " + (grErr?.message || "unknown"));
      const { data: mb, error: mbErr } = await sb
        .from("members")
        .insert({
          group_id: gr.id,
          name: input.adminName,
          email: input.adminEmail,
          role: "admin",
        })
        .select()
        .single();
      if (mbErr || !mb) throw new Error("Uye olusturulamadi: " + (mbErr?.message || "unknown"));
      return { group: gr as Group, member: mb as Member };
    }
  }
  return mockCreateGroup(input);
}

async function mockCreateGroup(input: {
  name: string;
  adminName: string;
  adminEmail: string;
}): Promise<{ group: Group; member: Member }> {
  let inviteCode = genInviteCode();
  let attempts = 0;
  while (attempts < 5) {
    const existing = await mockDB.getGroupByInviteCode(inviteCode);
    if (!existing) break;
    inviteCode = genInviteCode();
    attempts++;
  }
  const group = await mockDB.insertGroup({
    name: input.name,
    invite_code: inviteCode,
    created_by_email: input.adminEmail,
  });
  const member = await mockDB.insertMember({
    group_id: group.id,
    name: input.adminName,
    email: input.adminEmail,
    role: "admin",
  });
  return { group, member };
}

export async function getGroupByInviteCode(code: string): Promise<Group | null> {
  if (hasSupabase()) {
    const sb = createServerClient();
    if (sb) {
      const { data } = await sb.from("groups").select("*").eq("invite_code", code).maybeSingle();
      return (data as Group | null) || null;
    }
  }
  return mockDB.getGroupByInviteCode(code);
}

export async function getGroupById(id: string): Promise<Group | null> {
  if (hasSupabase()) {
    const sb = createServerClient();
    if (sb) {
      const { data } = await sb.from("groups").select("*").eq("id", id).maybeSingle();
      return (data as Group | null) || null;
    }
  }
  return mockDB.getGroupById(id);
}

export async function addOrGetMember(input: {
  groupId: string;
  name: string;
  email: string;
  role?: "admin" | "member";
}): Promise<Member> {
  if (hasSupabase()) {
    const sb = createServerClient();
    if (sb) {
      const { data: existing } = await sb
        .from("members")
        .select("*")
        .eq("group_id", input.groupId)
        .eq("email", input.email)
        .maybeSingle();
      if (existing) return existing as Member;
      const { data, error } = await sb
        .from("members")
        .insert({
          group_id: input.groupId,
          name: input.name,
          email: input.email,
          role: input.role || "member",
        })
        .select()
        .single();
      if (error || !data) throw new Error("Uye eklenemedi: " + (error?.message || "unknown"));
      return data as Member;
    }
  }
  return mockDB.insertMember({
    group_id: input.groupId,
    name: input.name,
    email: input.email,
    role: input.role || "member",
  });
}

export async function getMembers(groupId: string): Promise<Member[]> {
  if (hasSupabase()) {
    const sb = createServerClient();
    if (sb) {
      const { data } = await sb.from("members").select("*").eq("group_id", groupId).order("joined_at");
      return (data as Member[]) || [];
    }
  }
  return mockDB.getMembersByGroup(groupId);
}

export async function getMemberById(id: string): Promise<Member | null> {
  if (hasSupabase()) {
    const sb = createServerClient();
    if (sb) {
      const { data } = await sb.from("members").select("*").eq("id", id).maybeSingle();
      return (data as Member | null) || null;
    }
  }
  return mockDB.getMemberById(id);
}

export async function upsertTopic(groupId: string, title: string): Promise<Topic> {
  if (hasSupabase()) {
    const sb = createServerClient();
    if (sb) {
      const now = new Date().toISOString();
      const { data: existing } = await sb.from("topics").select("*").eq("group_id", groupId).maybeSingle();
      if (existing) {
        const { data, error } = await sb
          .from("topics")
          .update({ title, updated_at: now })
          .eq("id", existing.id)
          .select()
          .single();
        if (error || !data) throw new Error("Konu guncellenemedi");
        return data as Topic;
      }
      const { data, error } = await sb
        .from("topics")
        .insert({ group_id: groupId, title, created_at: now, updated_at: now })
        .select()
        .single();
      if (error || !data) throw new Error("Konu eklenemedi");
      return data as Topic;
    }
  }
  return mockDB.upsertTopic(groupId, title);
}

export async function getTopic(groupId: string): Promise<Topic | null> {
  if (hasSupabase()) {
    const sb = createServerClient();
    if (sb) {
      const { data } = await sb.from("topics").select("*").eq("group_id", groupId).maybeSingle();
      return (data as Topic | null) || null;
    }
  }
  return mockDB.getTopicByGroup(groupId);
}

export async function upsertComposition(data: Omit<Composition, "id" | "created_at" | "updated_at">): Promise<Composition> {
  if (hasSupabase()) {
    const sb = createServerClient();
    if (sb) {
      const now = new Date().toISOString();
      const { data: existing } = await sb
        .from("compositions")
        .select("*")
        .eq("group_id", data.group_id)
        .eq("member_id", data.member_id)
        .eq("topic_id", data.topic_id)
        .maybeSingle();
      if (existing) {
        const { data: up, error } = await sb
          .from("compositions")
          .update({ content: data.content, updated_at: now })
          .eq("id", existing.id)
          .select()
          .single();
        if (error || !up) throw new Error("Kompozisyon guncellenemedi");
        return up as Composition;
      }
      const { data: ins, error } = await sb
        .from("compositions")
        .insert({ ...data, created_at: now, updated_at: now })
        .select()
        .single();
      if (error || !ins) throw new Error("Kompozisyon eklenemedi");
      return ins as Composition;
    }
  }
  return mockDB.upsertComposition(data);
}

export async function getCompositions(groupId: string): Promise<Composition[]> {
  if (hasSupabase()) {
    const sb = createServerClient();
    if (sb) {
      const { data } = await sb.from("compositions").select("*").eq("group_id", groupId);
      return (data as Composition[]) || [];
    }
  }
  return mockDB.getCompositionsByGroup(groupId);
}
