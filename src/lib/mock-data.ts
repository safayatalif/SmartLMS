export type PlanId = "basic" | "prime" | "elite";

export const plans = [
  {
    id: "basic" as const,
    name: { en: "Basic Reader", bn: "বেসিক রিডার" },
    price: 0,
    period: { en: "Free forever", bn: "সবসময় ফ্রি" },
    featured: false,
    blurb: {
      en: "A starter shelf of open-access titles. Enough to begin.",
      bn: "ফ্রি বইয়ের একটি ছোট তাক। শুরু করার জন্য যথেষ্ট।",
    },
    features: {
      en: ["Limited catalog", "Mobile reader", "Search & bookmarks", "Community updates"],
      bn: ["সীমিত ক্যাটালগ", "মোবাইল রিডার", "সার্চ ও বুকমার্ক", "কমিউনিটি আপডেট"],
    },
  },
  {
    id: "prime" as const,
    name: { en: "Prime Reader", bn: "প্রাইম রিডার" },
    price: 50,
    period: { en: "/ month", bn: "/ মাস" },
    blurb: {
      en: "Most of the stacks, faster holds, and a quieter reading room.",
      bn: "বেশিরভাগ বই, দ্রুত রিজার্ভ, এবং নিরিবিলি পড়ার সুবিধা।",
    },
    features: {
      en: ["Most of the catalog", "Online reservation", "Availability alerts", "No ads"],
      bn: ["প্রায় পুরো ক্যাটালগ", "অনলাইন রিজার্ভ", "অ্যাভেইলেবিলিটি অ্যালার্ট", "বিজ্ঞাপনমুক্ত"],
    },
    featured: true,
  },
  {
    id: "elite" as const,
    name: { en: "Elite Reader", bn: "এলিট রিডার" },
    price: 150,
    period: { en: "/ month", bn: "/ মাস" },
    featured: false,
    blurb: {
      en: "Every title, early access, and offline downloads for long nights.",
      bn: "সব বই, আগাম অ্যাক্সেস, এবং অফলাইন ডাউনলোড।",
    },
    features: {
      en: ["Full catalog", "Offline download", "Early releases", "Priority support"],
      bn: ["সম্পূর্ণ ক্যাটালগ", "অফলাইন ডাউনলোড", "আগাম রিলিজ", "প্রায়োরিটি সাপোর্ট"],
    },
  },
];

export const books = [
  {
    id: "intro-algorithms",
    title: { en: "Introduction to Algorithms", bn: "অ্যালগরিদমের ভূমিকা" },
    author: "Cormen, Leiserson, Rivest",
    category: { en: "Academic", bn: "একাডেমিক" },
    tier: "prime" as PlanId,
    pages: 1312,
    year: 2022,
    rating: 4.9,
    copies: 18,
    borrowed: 11,
    summary: {
      en: "The standard text for undergraduate algorithms — clear proofs, worked examples, and problems that stay with you.",
      bn: "অ্যান্ডারগ্র্যাজুয়েট অ্যালগরিদমের স্ট্যান্ডার্ড বই — পরিষ্কার প্রুফ ও অনুশীলনী।",
    },
    palette: ["#7a2e3a", "#f3eee4", "#1c1612"],
  },
  {
    id: "database-concepts",
    title: { en: "Database System Concepts", bn: "ডেটাবেস সিস্টেম কনসেপ্টস" },
    author: "Silberschatz, Korth",
    category: { en: "Academic", bn: "একাডেমিক" },
    tier: "basic" as PlanId,
    pages: 1376,
    year: 2019,
    rating: 4.7,
    copies: 22,
    borrowed: 9,
    summary: {
      en: "Relational models, SQL, and transactions taught the way a working librarian of data would explain them.",
      bn: "রিলেশনাল মডেল, SQL এবং ট্রানজ্যাকশন — কাজের ভাষায়।",
    },
    palette: ["#1e3328", "#e4efe6", "#c4a35a"],
  },
  {
    id: "sonar-tori",
    title: { en: "Sonar Tori", bn: "সোনার তরী" },
    author: "Rabindranath Tagore",
    category: { en: "Poetry", bn: "কবিতা" },
    tier: "basic" as PlanId,
    pages: 128,
    year: 1894,
    rating: 4.8,
    copies: 14,
    borrowed: 6,
    summary: {
      en: "A golden boat on a monsoon river — still the poem Bangladeshi readers return to first.",
      bn: "বর্ষার নদীতে সোনার তরী — বাংলা পাঠকের প্রথম ফেরত আসা কবিতা।",
    },
    palette: ["#c4a35a", "#7a2e3a", "#f3eee4"],
  },
  {
    id: "clean-code",
    title: { en: "Clean Code", bn: "ক্লিন কোড" },
    author: "Robert C. Martin",
    category: { en: "Professional", bn: "পেশাগত" },
    tier: "prime" as PlanId,
    pages: 464,
    year: 2008,
    rating: 4.6,
    copies: 10,
    borrowed: 8,
    summary: {
      en: "Craft, naming, and the quiet discipline of software that other people can still read.",
      bn: "নামকরণ, কারুকাজ, এবং অন্যের পড়ার মতো সফটওয়্যার।",
    },
    palette: ["#1c1612", "#c45c3e", "#f3eee4"],
  },
  {
    id: "pather-panchali",
    title: { en: "Pather Panchali", bn: "পথের পাঁচালী" },
    author: "Bibhutibhushan Bandyopadhyay",
    category: { en: "Fiction", bn: "উপন্যাস" },
    tier: "basic" as PlanId,
    pages: 456,
    year: 1929,
    rating: 4.9,
    copies: 16,
    borrowed: 7,
    summary: {
      en: "A village childhood told without hurry — dust, hunger, and a sky that never quite ends.",
      bn: "গ্রামের শৈশব — ধুলা, ক্ষুধা, আর শেষ না-হওয়া আকাশ।",
    },
    palette: ["#3e5c4a", "#e7decd", "#1c1612"],
  },
  {
    id: "computer-networks",
    title: { en: "Computer Networks", bn: "কম্পিউটার নেটওয়ার্কস" },
    author: "Andrew S. Tanenbaum",
    category: { en: "Academic", bn: "একাডেমিক" },
    tier: "elite" as PlanId,
    pages: 960,
    year: 2021,
    rating: 4.7,
    copies: 8,
    borrowed: 5,
    summary: {
      en: "From packets to protocols — the map of how libraries, and everything else, talk.",
      bn: "প্যাকেট থেকে প্রোটোকল — লাইব্রেরি কীভাবে কথা বলে তার মানচিত্র।",
    },
    palette: ["#541822", "#c4a35a", "#fffbf4"],
  },
  {
    id: "lalsalu",
    title: { en: "Lalsalu", bn: "লালসালু" },
    author: "Syed Waliullah",
    category: { en: "Fiction", bn: "উপন্যাস" },
    tier: "prime" as PlanId,
    pages: 176,
    year: 1948,
    rating: 4.8,
    copies: 12,
    borrowed: 4,
    summary: {
      en: "A red cloth over a grave, and a village learning what belief can cost.",
      bn: "কবরের ওপর লাল কাপড়, আর বিশ্বাসের দাম।",
    },
    palette: ["#c45c3e", "#1c1612", "#f3eee4"],
  },
  {
    id: "psychology-money",
    title: { en: "The Psychology of Money", bn: "মানির সাইকোলজি" },
    author: "Morgan Housel",
    category: { en: "Non-fiction", bn: "নন-ফিকশন" },
    tier: "prime" as PlanId,
    pages: 256,
    year: 2020,
    rating: 4.5,
    copies: 20,
    borrowed: 14,
    summary: {
      en: "How people actually behave with money, told in short essays you can read between classes.",
      bn: "টাকার সাথে মানুষের আসল আচরণ — ক্লাসের ফাঁকে পড়ার মতো।",
    },
    palette: ["#c4a35a", "#1e3328", "#fffbf4"],
  },
  {
    id: "os-concepts",
    title: { en: "Operating System Concepts", bn: "অপারেটিং সিস্টেম কনসেপ্টস" },
    author: "Silberschatz, Galvin",
    category: { en: "Academic", bn: "একাডেমিক" },
    tier: "elite" as PlanId,
    pages: 1120,
    year: 2018,
    rating: 4.6,
    copies: 9,
    borrowed: 9,
    summary: {
      en: "Processes, memory, files — the machinery under every reader app, including this one.",
      bn: "প্রসেস, মেমোরি, ফাইল — এই অ্যাপের নিচের যন্ত্রপাতি।",
    },
    palette: ["#1e3328", "#c4a35a", "#f3eee4"],
  },
  {
    id: "himer-jole",
    title: { en: "Himur Ache Jol", bn: "হিমুর আছে জল" },
    author: "Humayun Ahmed",
    category: { en: "Fiction", bn: "উপন্যাস" },
    tier: "basic" as PlanId,
    pages: 192,
    year: 1990,
    rating: 4.7,
    copies: 24,
    borrowed: 10,
    summary: {
      en: "Himu wanders Dhaka in yellow panjabi, collecting people the way libraries collect spines.",
      bn: "হলুদ পাঞ্জাবিতে ঢাকা ঘোরা হিমু — মানুষ জড়ায় যেমন লাইব্রেরি বই জড়ায়।",
    },
    palette: ["#c4a35a", "#7a2e3a", "#e7decd"],
  },
  {
    id: "atomic-habits",
    title: { en: "Atomic Habits", bn: "অ্যাটমিক হ্যাবিটস" },
    author: "James Clear",
    category: { en: "Self-help", bn: "সেলফ-হেল্প" },
    tier: "prime" as PlanId,
    pages: 320,
    year: 2018,
    rating: 4.6,
    copies: 15,
    borrowed: 12,
    summary: {
      en: "Tiny systems for showing up — including showing up to read twenty pages a night.",
      bn: "ছোট অভ্যাস — রাতে বিশ পাতা পড়ার মতো।",
    },
    palette: ["#3e5c4a", "#fffbf4", "#1c1612"],
  },
  {
    id: "design-patterns",
    title: { en: "Design Patterns", bn: "ডিজাইন প্যাটার্নস" },
    author: "Gamma, Helm, Johnson, Vlissides",
    category: { en: "Professional", bn: "পেশাগত" },
    tier: "elite" as PlanId,
    pages: 416,
    year: 1994,
    rating: 4.8,
    copies: 7,
    borrowed: 3,
    summary: {
      en: "The gang of four, still teaching how software (and catalogs) can be composed.",
      bn: "গ্যাং অব ফোর — সফটওয়্যার ও ক্যাটালগ কীভাবে গঠিত হয়।",
    },
    palette: ["#1c1612", "#c4a35a", "#7a2e3a"],
  },
];

export const members = [
  { id: "m1", name: "Safayat Hossen Alif", email: "2024100010063@seu.edu.bd", plan: "elite" as PlanId, status: "active", joined: "Jan 2026", books: 6 },
  { id: "m2", name: "Md. Samiul Haque", email: "2024100010069@seu.edu.bd", plan: "prime" as PlanId, status: "active", joined: "Jan 2026", books: 4 },
  { id: "m3", name: "Md. Mustasin Billah", email: "2024100010074@seu.edu.bd", plan: "basic" as PlanId, status: "active", joined: "Feb 2026", books: 2 },
  { id: "m4", name: "Sadik-Ul Haque", email: "captainsamiul@gmail.com", plan: "prime" as PlanId, status: "active", joined: "Mar 2026", books: 5 },
  { id: "m5", name: "Ariyan Masrur", email: "ariyanmasrur31@gmail.com", plan: "basic" as PlanId, status: "pending", joined: "Apr 2026", books: 1 },
  { id: "m6", name: "Sariot Hossain", email: "2024100010092@seu.edu.bd", plan: "elite" as PlanId, status: "active", joined: "Apr 2026", books: 8 },
  { id: "m7", name: "Syed Abdullahil Galib", email: "princelunatic39@gmail.com", plan: "prime" as PlanId, status: "expired", joined: "Dec 2025", books: 0 },
  { id: "m8", name: "MD Rubayet Hossain", email: "outtazimfind23@gmail.com", plan: "prime" as PlanId, status: "active", joined: "May 2026", books: 3 },
];

export const payments = [
  { id: "p1", member: "Safayat Hossen Alif", plan: "Elite Reader", amount: 150, method: "bKash", status: "paid", date: "12 Aug 2026" },
  { id: "p2", member: "Sariot Hossain", plan: "Elite Reader", amount: 150, method: "Nagad", status: "paid", date: "10 Aug 2026" },
  { id: "p3", member: "Md. Samiul Haque", plan: "Prime Reader", amount: 50, method: "Rocket", status: "paid", date: "08 Aug 2026" },
  { id: "p4", member: "Sadik-Ul Haque", plan: "Prime Reader", amount: 50, method: "bKash", status: "paid", date: "05 Aug 2026" },
  { id: "p5", member: "Syed Abdullahil Galib", plan: "Prime Reader", amount: 50, method: "Card", status: "failed", date: "02 Aug 2026" },
  { id: "p6", member: "MD Rubayet Hossain", plan: "Prime Reader", amount: 50, method: "Nagad", status: "paid", date: "01 Aug 2026" },
];

export const stats = {
  members: 1284,
  books: 6420,
  borrowed: 918,
  revenue: 48250,
};

export function planLabel(id: PlanId, lang: "en" | "bn") {
  const plan = plans.find((p) => p.id === id);
  return plan ? plan.name[lang] : id;
}

export function getBook(id: string) {
  return books.find((b) => b.id === id);
}
