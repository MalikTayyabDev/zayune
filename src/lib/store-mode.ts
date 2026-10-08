import { getSettings } from "@/lib/products";

export type StoreModeValue = "LIVE" | "COMING_SOON";

export async function getStoreMode(): Promise<StoreModeValue> {
  try {
    const settings = await getSettings();
    const mode =
      "storeMode" in settings && settings.storeMode
        ? String(settings.storeMode)
        : "COMING_SOON";
    return mode === "LIVE" ? "LIVE" : "COMING_SOON";
  } catch {
    // Missing storeMode column (P2022) or other settings read failure — safe default.
    return "COMING_SOON";
  }
}

export async function isStoreComingSoon() {
  try {
    return (await getStoreMode()) === "COMING_SOON";
  } catch {
    return true;
  }
}
