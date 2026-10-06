export type DemoTicket = {
  id: string;
  ticketId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "OPEN" | "CLOSED";
  createdAt: Date;
};

export type DemoSubscriber = {
  id: string;
  email: string;
  name: string | null;
  couponCode: string;
  createdAt: Date;
};

const g = globalThis as unknown as {
  __zayuneTickets?: DemoTicket[];
  __zayuneSubscribers?: DemoSubscriber[];
};

export function getDemoTickets() {
  if (!g.__zayuneTickets) g.__zayuneTickets = [];
  return g.__zayuneTickets;
}

export function getDemoSubscribers() {
  if (!g.__zayuneSubscribers) g.__zayuneSubscribers = [];
  return g.__zayuneSubscribers;
}
