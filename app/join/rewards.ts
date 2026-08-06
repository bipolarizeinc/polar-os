export type Prize = {
  label: string;
  code: string;
  active: boolean;
};

export const prizes: Prize[] = [
  { label: "5% off one eligible service", code: "SINGLE-05", active: true },
  { label: "10% off one eligible service", code: "SINGLE-10", active: true },
  { label: "15% off one eligible service", code: "SINGLE-15", active: true },
  { label: "20% off one eligible service", code: "SINGLE-20", active: true },
  { label: "10% off an eligible bundle", code: "BUNDLE-10", active: true },
  { label: "20% off an eligible bundle", code: "BUNDLE-20", active: true },
  { label: "One free Academy course", code: "ACADEMY-COURSE", active: true },
  { label: "$100 off one eligible non-promotional offer", code: "OFFER-100", active: true },
  { label: "Free business evaluation with consultation", code: "BUSINESS-EVAL", active: true },
  { label: "Free ETAS assessment", code: "ETAS-FREE", active: true },
  { label: "Logo design at 75% off", code: "LOGO-75", active: true },
];

export const activePrizes = prizes.filter((prize) => prize.active);
