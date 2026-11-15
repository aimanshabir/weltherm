export const SITE = {
  name: "Weltherm",
  tagline: "Appliances of Wellness",
  description:
    "Weltherm manufactures high-quality home appliances — heating, kitchen and wellness products — serving 100,000+ customers across India since 2015.",
  url: "https://weltherm.com",
  email: "info@weltherm.com",
  supportEmail: "support@weltherm.com",
  connectEmail: "customer.connect@weltherm.com",
  phone: "1800-572-6223",
  phones: ["+1 (614) 707-9897", "+1-343-987-2775", "+91-1800-572-6223", "+97-1503970616"],
  social: {
    facebook: "https://www.facebook.com/weltherm.home",
    instagram: "https://www.instagram.com/weltherm_appliances/",
  },
  amazonUrl:
    "https://www.amazon.in/stores/WELTHERM/WELTHERM/page/C0D445AC-5AA7-4A2E-AF5C-38568E37D878",
  flipkartUrl: "https://www.flipkart.com/q=weltherm+appliances",
} as const;

export const OFFICES = [
  {
    country: "India",
    lines: [
      "Basement Floor 1165, Booth no 148, Railway Road,",
      "opposite Fire Station, Mahavir Pura,",
      "Gurugram, Haryana – 122006",
    ],
  },
  {
    country: "UAE",
    lines: [
      "Office No-118/A-006, Avenue Business Center,",
      "11th Floor, Binary Tower, Al Abraj Street,",
      "Business Bay, Dubai",
    ],
  },
  {
    country: "USA",
    lines: ["302 Linda Lee Ln,", "Lewis Center, OH, 43035,", "Ph. +1 (614) 707-9897"],
  },
  {
    country: "Canada",
    lines: ["57-3240, Southgate Road,", "Ottawa, ON, K1V 0B7"],
  },
] as const;

export const CATEGORY_GROUPS = [
  { key: "kitchen", label: "Kitchen Appliances", blurb: "Cook smarter with rice cookers, infrared cooktops, mixers and more." },
  { key: "heating", label: "Heating Appliances", blurb: "Stay warm all winter — blankets, PTC, oil, gas and quartz heaters." },
  { key: "cooling", label: "Cooling Appliances", blurb: "Refreshing comfort for the hot months." },
  { key: "floor-heating", label: "Floor Heating System", blurb: "Even, energy-efficient warmth under your feet." },
  { key: "others", label: "More", blurb: "Wellness and home-care appliances." },
] as const;

export const SERVICES = [
  {
    title: "Customer Support",
    description:
      "Need some help? Call us at 1800-572-6223 for phone support or email us at support@weltherm.com — we're happy to assist.",
    icon: "headset",
  },
  {
    title: "Repair or Replacement Guarantee",
    description:
      "Don't worry if a product is defective or stops working. Weltherm provides repair services under warranty and guaranteed replacement within the replacement policy window.",
    icon: "wrench",
  },
  {
    title: "Zero Paperwork",
    description:
      "Be hassle-free with us — no paperwork when purchasing a product or servicing any of your home appliances.",
    icon: "doc",
  },
  {
    title: "Return Policy",
    description:
      "Dissatisfied with a delivered product or changed your mind? Request a return within 7 days from the date of delivery.",
    icon: "return",
  },
  {
    title: "Terms & Conditions",
    description:
      "One-year warranty on all products. Return and replacement of any product can be done within 7 days at the nearest service center.",
    icon: "shield",
  },
  {
    title: "No Questions Asked",
    description:
      "We never question a customer who reports a problem with an appliance bought from us. We simply fix it.",
    icon: "check",
  },
] as const;

export const STATS = [
  { value: "2015", label: "Serving since" },
  { value: "100K+", label: "Happy customers" },
  { value: "93+", label: "Products" },
  { value: "4", label: "Global offices" },
] as const;

export const AMAZON_STORE_URL = SITE.amazonUrl;
