export interface Group {
  id: string;
  name: string;
  invite_code: string;
  created_by_email: string;
  created_at: string;
}

export interface Member {
  id: string;
  group_id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  joined_at: string;
}

export interface Topic {
  id: string;
  group_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Composition {
  id: string;
  group_id: string;
  member_id: string;
  topic_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface MockStore {
  groups: Group[];
  members: Member[];
  topics: Topic[];
  compositions: Composition[];
}

const GROUPS_KEY = "mock_store_groups_v1";
const MEMBERS_KEY = "mock_store_members_v1";
const TOPICS_KEY = "mock_store_topics_v1";
const COMPS_KEY = "mock_store_comps_v1";

let fsMod: any = null;
let pathMod: any = null;
let dataFilePath: string | null = null;
let inMemoryCache: MockStore | null = null;

function isServerSide(): boolean {
  return typeof window === "undefined" && typeof globalThis !== "undefined";
}

async function initFsModules(): Promise<void> {
  if (!isServerSide()) return;
  if (fsMod && pathMod && dataFilePath) return;
  try {
    const g = globalThis as any;
    let fsP: any = null;
    let pathP: any = null;
    const req = g.require;
    if (req) {
      try {
        fsP = req("fs/promises");
        pathP = req("path");
      } catch {
        fsP = null;
        pathP = null;
      }
    }
    if (!fsP || !pathP) {
      try {
        const impFs = new Function('return import("fs/promises")') as () => Promise<any>;
        const impPath = new Function('return import("path")') as () => Promise<any>;
        const fsImp = await impFs();
        const pathImp = await impPath();
        fsP = fsImp;
        pathP = pathImp;
      } catch {
        fsP = null;
        pathP = null;
      }
    }
    if (!fsP || !pathP) return;
    fsMod = fsP;
    pathMod = pathP;
    const proc = g.process;
    const cwd = proc?.cwd?.() || "";
    if (cwd) {
      dataFilePath = pathMod.join(cwd, ".mock-data.json");
    }
  } catch {
    fsMod = null;
    pathMod = null;
    dataFilePath = null;
  }
}

async function readFileStore(): Promise<MockStore | null> {
  await initFsModules();
  if (!fsMod || !dataFilePath) return null;
  try {
    const raw = await fsMod.readFile(dataFilePath, "utf-8");
    const parsed = JSON.parse(raw) as MockStore;
    if (
      parsed &&
      Array.isArray(parsed.groups) &&
      Array.isArray(parsed.members) &&
      Array.isArray(parsed.topics) &&
      Array.isArray(parsed.compositions)
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

async function writeFileStore(data: MockStore): Promise<void> {
  await initFsModules();
  if (!fsMod || !dataFilePath) return;
  try {
    await fsMod.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // ignore write errors
  }
}

function emptyStore(): MockStore {
  return { groups: [], members: [], topics: [], compositions: [] };
}

async function loadStore(): Promise<MockStore> {
  if (!isServerSide()) {
    return emptyStore();
  }
  if (!inMemoryCache) {
    const fromFile = await readFileStore();
    inMemoryCache = fromFile || emptyStore();
  }
  return inMemoryCache;
}

async function persistStore(): Promise<void> {
  if (!isServerSide() || !inMemoryCache) return;
  await writeFileStore(inMemoryCache);
}

function clearCache(): void {
  inMemoryCache = null;
}

function getStore(): MockStore {
  if (typeof globalThis === "undefined") {
    return { groups: [], members: [], topics: [], compositions: [] };
  }
  const g = (globalThis as any)[GROUPS_KEY] as Group[] | undefined;
  const m = (globalThis as any)[MEMBERS_KEY] as Member[] | undefined;
  const t = (globalThis as any)[TOPICS_KEY] as Topic[] | undefined;
  const c = (globalThis as any)[COMPS_KEY] as Composition[] | undefined;
  if (!g) (globalThis as any)[GROUPS_KEY] = [];
  if (!m) (globalThis as any)[MEMBERS_KEY] = [];
  if (!t) (globalThis as any)[TOPICS_KEY] = [];
  if (!c) (globalThis as any)[COMPS_KEY] = [];
  return {
    groups: (globalThis as any)[GROUPS_KEY],
    members: (globalThis as any)[MEMBERS_KEY],
    topics: (globalThis as any)[TOPICS_KEY],
    compositions: (globalThis as any)[COMPS_KEY],
  };
}

async function getStorePersisted(): Promise<MockStore> {
  if (isServerSide()) {
    return await loadStore();
  }
  return getStore();
}

async function commitStore(): Promise<void> {
  if (isServerSide()) {
    await persistStore();
  }
}

function genUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function dbHasSupabase(): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key);
}

export function clearMockCache(): void {
  clearCache();
}

export const mockDB = {
  async insertGroup(data: Pick<Group, "name" | "invite_code" | "created_by_email">): Promise<Group> {
    const store = await getStorePersisted();
    const gr: Group = {
      id: genUuid(),
      name: data.name,
      invite_code: data.invite_code,
      created_by_email: data.created_by_email,
      created_at: new Date().toISOString(),
    };
    store.groups.push(gr);
    await commitStore();
    return gr;
  },

  async getGroupByInviteCode(code: string): Promise<Group | null> {
    const store = await getStorePersisted();
    return store.groups.find((g) => g.invite_code === code) || null;
  },

  async getGroupById(id: string): Promise<Group | null> {
    const store = await getStorePersisted();
    return store.groups.find((g) => g.id === id) || null;
  },

  async insertMember(data: Pick<Member, "group_id" | "name" | "email" | "role">): Promise<Member> {
    const store = await getStorePersisted();
    const existing = store.members.find((m) => m.group_id === data.group_id && m.email === data.email);
    if (existing) return existing;
    const mb: Member = {
      id: genUuid(),
      group_id: data.group_id,
      name: data.name,
      email: data.email,
      role: data.role,
      joined_at: new Date().toISOString(),
    };
    store.members.push(mb);
    await commitStore();
    return mb;
  },

  async getMembersByGroup(groupId: string): Promise<Member[]> {
    const store = await getStorePersisted();
    return store.members.filter((m) => m.group_id === groupId);
  },

  async getMemberById(id: string): Promise<Member | null> {
    const store = await getStorePersisted();
    return store.members.find((m) => m.id === id) || null;
  },

  async upsertTopic(groupId: string, title: string): Promise<Topic> {
    const store = await getStorePersisted();
    const now = new Date().toISOString();
    const existing = store.topics.find((t) => t.group_id === groupId);
    if (existing) {
      existing.title = title;
      existing.updated_at = now;
      await commitStore();
      return existing;
    }
    const t: Topic = {
      id: genUuid(),
      group_id: groupId,
      title,
      created_at: now,
      updated_at: now,
    };
    store.topics.push(t);
    await commitStore();
    return t;
  },

  async getTopicByGroup(groupId: string): Promise<Topic | null> {
    const store = await getStorePersisted();
    return store.topics.find((t) => t.group_id === groupId) || null;
  },

  async upsertComposition(data: Omit<Composition, "id" | "created_at" | "updated_at">): Promise<Composition> {
    const store = await getStorePersisted();
    const now = new Date().toISOString();
    const existing = store.compositions.find(
      (c) =>
        c.group_id === data.group_id &&
        c.member_id === data.member_id &&
        c.topic_id === data.topic_id
    );
    if (existing) {
      existing.content = data.content;
      existing.updated_at = now;
      await commitStore();
      return existing;
    }
    const c: Composition = {
      id: genUuid(),
      ...data,
      created_at: now,
      updated_at: now,
    };
    store.compositions.push(c);
    await commitStore();
    return c;
  },

  async getCompositionsByGroup(groupId: string): Promise<Composition[]> {
    const store = await getStorePersisted();
    return store.compositions.filter((c) => c.group_id === groupId);
  },
};
