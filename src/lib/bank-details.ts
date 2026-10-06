export function getBankDetails() {
  return {
    bankName: process.env.BANK_NAME || "[Bank name — to be supplied]",
    accountTitle: process.env.BANK_ACCOUNT_TITLE || "ZAYUNE",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || "[Account number — to be supplied]",
    iban: process.env.BANK_IBAN || "[IBAN / Raast ID — to be supplied]",
  };
}

export function formatAdvance(total: number) {
  return Math.round(total * 0.3);
}
