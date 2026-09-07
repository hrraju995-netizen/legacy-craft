/** One place for the numbers that were previously hard-coded per page. */
export const siteConfig = {
  name: "Legacy Craft Studio",
  description:
    "Handcrafted beds, sofas, desks and office furniture built in Bangladesh. Free delivery on orders over ৳50,000.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://legacycraftstudio.com",
  phone: "+8801897711118",
  whatsapp: "8801897711118",
  email: "support@legacycraftstudio.com",
  messenger: "legacycraftstudio",
  secondaryPhone: "+8801727090737",
  address:
    "Shop No: 33, Round Glass Bay, Level 5, Mirpur DOHS Shopping Complex, Dhaka, Bangladesh",
  social: {
    facebook: "https://facebook.com/legacycraftstudio",
    instagram: "https://instagram.com/legacycraftstudio",
    youtube: "https://youtube.com/@legacycraftstudio",
  },
};

/** Cart and checkout both read these — they used to disagree (70/130 vs 60/120). */
export const SHIPPING_OPTIONS = [
  {
    id: "inside",
    label: "Inside Dhaka",
    note: "Regular Delivery (1–2 days)",
    cost: 70,
  },
  {
    id: "outside",
    label: "Outside Dhaka",
    note: "Courier Delivery (2–4 days)",
    cost: 130,
  },
];

export const FREE_SHIPPING_THRESHOLD = 50000;

export const getShippingCost = (areaId, subtotal = 0) => {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  const option = SHIPPING_OPTIONS.find((o) => o.id === areaId);
  return option ? option.cost : SHIPPING_OPTIONS[0].cost;
};

export const formatTk = (value = 0) => `৳${Number(value).toLocaleString("en-BD")}`;
