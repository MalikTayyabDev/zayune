export type DemoCustomRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  pieceType: string;
  colors: string;
  details: string;
  occasion: string;
  budget: string;
  neededBy: Date | null;
  referenceUrl: string | null;
  status: "NEW" | "REVIEWING" | "QUOTED" | "CLOSED";
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const globalStore = globalThis as unknown as {
  __zayuneCustomRequests?: DemoCustomRequest[];
};

export function getDemoCustomRequests() {
  if (!globalStore.__zayuneCustomRequests) {
    globalStore.__zayuneCustomRequests = [];
  }
  return globalStore.__zayuneCustomRequests;
}

export function listDemoCustomRequests() {
  return [...getDemoCustomRequests()].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export function listDemoCustomRequestsByEmail(email: string) {
  const normalized = email.toLowerCase();
  return listDemoCustomRequests().filter(
    (req) => req.email.toLowerCase() === normalized
  );
}

export function addDemoCustomRequest(
  data: Omit<DemoCustomRequest, "id" | "status" | "adminNotes" | "createdAt" | "updatedAt">
) {
  const now = new Date();
  const entry: DemoCustomRequest = {
    ...data,
    id: `cr_${Date.now().toString(36)}`,
    status: "NEW",
    adminNotes: null,
    createdAt: now,
    updatedAt: now,
  };
  getDemoCustomRequests().unshift(entry);
  return entry;
}

export function updateDemoCustomRequest(
  id: string,
  patch: Partial<Pick<DemoCustomRequest, "status" | "adminNotes">>
) {
  const list = getDemoCustomRequests();
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return null;
  list[index] = {
    ...list[index],
    ...patch,
    updatedAt: new Date(),
  };
  return list[index];
}
