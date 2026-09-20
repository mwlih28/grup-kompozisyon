import { cookies } from "next/headers";

const GROUP_COOKIE = "gk_group_member_v1";

export interface SessionMember {
  memberId: string;
  groupId: string;
}

export function parseSessionCookie(raw: string | undefined): SessionMember | null {
  if (!raw) return null;
  try {
    const parts = raw.split("::");
    if (parts.length !== 2) return null;
    return { memberId: parts[0], groupId: parts[1] };
  } catch {
    return null;
  }
}

export function serializeSessionCookie(s: SessionMember): string {
  return `${s.memberId}::${s.groupId}`;
}

export function getSession(groupId?: string): SessionMember | null {
  try {
    const store = cookies();
    const all = store.get(GROUP_COOKIE)?.value;
    if (!all) return null;
    const entries = all.split("|").filter(Boolean).map(parseSessionCookie).filter(Boolean) as SessionMember[];
    if (groupId) {
      return entries.find((e) => e.groupId === groupId) || null;
    }
    return entries[0] || null;
  } catch {
    return null;
  }
}

export function setSession(s: SessionMember) {
  try {
    const store = cookies();
    const all = store.get(GROUP_COOKIE)?.value || "";
    const entries = all.split("|").filter(Boolean).map(parseSessionCookie).filter(Boolean) as SessionMember[];
    // Replace existing session for the same group or add new one
    const others = entries.filter((e) => e.groupId !== s.groupId);
    others.push(s);
    const newValue = others.map(serializeSessionCookie).join("|");
    store.set(GROUP_COOKIE, newValue, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  } catch (e) {
    console.error("Failed to set session:", e);
    // ignore
  }
}

export { GROUP_COOKIE };
