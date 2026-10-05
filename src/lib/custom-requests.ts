export const PIECE_TYPES = [
  { value: "flower", label: "Crochet flower" },
  { value: "jewelry", label: "Jewelry" },
  { value: "keychain", label: "Keychain" },
  { value: "colorway", label: "Colorway of an existing piece" },
  { value: "other", label: "Other / tell us more" },
] as const;

export const OCCASIONS = [
  { value: "gift", label: "Gift" },
  { value: "personal", label: "Personal" },
  { value: "wedding", label: "Wedding / event" },
  { value: "other", label: "Other" },
] as const;

export const BUDGET_RANGES = [
  { value: "under_2k", label: "Under PKR 2,000" },
  { value: "2_4k", label: "PKR 2,000 – 4,000" },
  { value: "4_7k", label: "PKR 4,000 – 7,000" },
  { value: "open", label: "Open / flexible" },
] as const;

export const CUSTOM_STATUSES = ["NEW", "REVIEWING", "QUOTED", "CLOSED"] as const;

export function labelFor(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string
) {
  return options.find((o) => o.value === value)?.label || value;
}

export function buildWhatsAppCustomMessage(input: {
  name: string;
  pieceType: string;
  colors: string;
  details: string;
  budget: string;
}) {
  const piece = labelFor(PIECE_TYPES, input.pieceType);
  const budget = labelFor(BUDGET_RANGES, input.budget);
  return [
    `Hi ZAYUNE — custom request from ${input.name}.`,
    `Piece: ${piece}`,
    `Colors: ${input.colors}`,
    `Budget: ${budget}`,
    `Details: ${input.details}`,
  ].join("\n");
}
