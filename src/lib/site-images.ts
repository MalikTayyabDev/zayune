/** Curated Unsplash imagery for ZAYUNE — crochet accessories niche. */

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const siteImages = {
  /** Hero & marketing */
  hero: {
    crochetBloom: u("photo-1700171518313-5dd219beaaa6", 2000),
    crochetBouquet: u("photo-1716400128984-3681f2005d22", 2000),
    crochetDetail: u("photo-1700171458554-46cfd3f2a87a", 2000),
    yarnStudio: u("photo-1595301390417-c66647b47e9f", 2000),
    jewelry: u("photo-1611652022419-a9419f74343d", 2000),
    earrings: u("photo-1535632066927-ab7c9ab60908", 2000),
  },
  flowers: {
    clusterBlue: u("photo-1700171518313-5dd219beaaa6"),
    bowl: u("photo-1700171458554-46cfd3f2a87a"),
    carpet: u("photo-1700171394718-2457b1190444"),
    held: u("photo-1716400128984-3681f2005d22"),
    sunflower: u("photo-1753366556699-4be495e5bdd6"),
    onBook: u("photo-1752755098269-58113eb87d61"),
    yellow: u("photo-1708000077538-c7dfba8037d6"),
    whitePurple: u("photo-1595301490405-0ae747be39f6"),
    ground: u("photo-1700170928599-d7fc2d4ec97f"),
  },
  jewelry: {
    flatlay: u("photo-1611652022419-a9419f74343d"),
    earrings: u("photo-1535632066927-ab7c9ab60908"),
    necklace: u("photo-1599643478518-a784e5dc4c8f"),
    ringsSoft: u("photo-1515562141207-7a88fb7ce338"),
    pearl: u("photo-1573408301185-91496af5d5b9"),
  },
  keychains: {
    crochetCharm: u("photo-1700161093261-e059af3897c7"),
    smallBloom: u("photo-1700170447159-9d2d0da133a5"),
    yarnAccent: u("photo-1622648147611-e817249f3b73"),
  },
  studio: {
    yarnBalls: u("photo-1595301390417-c66647b47e9f"),
    handsCraft: u("photo-1452860606245-08befc0ff44b"),
    flowersBook: u("photo-1752755098269-58113eb87d61"),
  },
} as const;

export function img(
  url: string,
  alt: string,
  kind = "hero",
  sortOrder = 0,
  id = ""
) {
  return { id, url, alt, kind, sortOrder, productId: "" };
}
