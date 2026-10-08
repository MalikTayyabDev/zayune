import { getSettings } from "@/lib/products";

export type StoreModeValue = "LIVE" | "COMING_SOON";

export async function getStoreMode(): Promise<StoreModeValue> {
  const settings = await getSettings();
  const mode =
    "storeMode" in settings && settings.storeMode
      ? String(settings.storeMode)
      : "COMING_SOON";
  return mode === "LIVE" ? "LIVE" : "COMING_SOON";
}

export async function isStoreComingSoon() {
  return (await getStoreMode()) === "COMING_SOON";
}
