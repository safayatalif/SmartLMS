import "dotenv/config";
import dns from "node:dns";
import bcrypt from "bcryptjs";
import pg from "pg";

dns.setDefaultResultOrder("ipv4first");

function parseDatabaseUrl(url: string) {
  const normalized = url.replace(/^postgresql:/i, "http:").replace(/^postgres:/i, "http:");
  const u = new URL(normalized);
  return {
    hostname: u.hostname,
    port: Number(u.port || 5432),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: decodeURIComponent(u.pathname.replace(/^\//, "")) || "neondb",
  };
}

const plans = [
  {
    id: "basic",
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
    id: "prime",
    name: { en: "Prime Reader", bn: "প্রাইম রিডার" },
    price: 50,
    period: { en: "/ month", bn: "/ মাস" },
    featured: true,
    blurb: {
      en: "Most of the stacks, faster holds, and a quieter reading room.",
      bn: "বেশিরভাগ বই, দ্রুত রিজার্ভ, এবং নিরিবিলি পড়ার সুবিধা।",
    },
    features: {
      en: ["Most of the catalog", "Online reservation", "Availability alerts", "No ads"],
      bn: ["প্রায় পুরো ক্যাটালগ", "অনলাইন রিজার্ভ", "অ্যাভেইলেবিলিটি অ্যালার্ট", "বিজ্ঞাপনমুক্ত"],
    },
  },
  {
    id: "elite",
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

const books = [
  {
    slug: "intro-algorithms",
    title: { en: "Introduction to Algorithms", bn: "অ্যালগরিদমের ভূমিকা" },
    author: "Cormen, Leiserson, Rivest",
    category: { en: "Academic", bn: "একাডেমিক" },
    tier: "prime",
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
    slug: "database-concepts",
    title: { en: "Database System Concepts", bn: "ডেটাবেস সিস্টেম কনসেপ্টস" },
    author: "Silberschatz, Korth",
    category: { en: "Academic", bn: "একাডেমিক" },
    tier: "basic",
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
    slug: "sonar-tori",
    title: { en: "Sonar Tori", bn: "সোনার তরী" },
    author: "Rabindranath Tagore",
    category: { en: "Poetry", bn: "কবিতা" },
    tier: "basic",
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
    slug: "clean-code",
    title: { en: "Clean Code", bn: "ক্লিন কোড" },
    author: "Robert C. Martin",
    category: { en: "Professional", bn: "পেশাগত" },
    tier: "prime",
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
    slug: "pather-panchali",
    title: { en: "Pather Panchali", bn: "পথের পাঁচালী" },
    author: "Bibhutibhushan Bandyopadhyay",
    category: { en: "Fiction", bn: "উপন্যাস" },
    tier: "basic",
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
    slug: "computer-networks",
    title: { en: "Computer Networks", bn: "কম্পিউটার নেটওয়ার্কস" },
    author: "Andrew S. Tanenbaum",
    category: { en: "Academic", bn: "একাডেমিক" },
    tier: "elite",
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
    slug: "lalsalu",
    title: { en: "Lalsalu", bn: "লালসালু" },
    author: "Syed Waliullah",
    category: { en: "Fiction", bn: "উপন্যাস" },
    tier: "prime",
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
    slug: "psychology-money",
    title: { en: "The Psychology of Money", bn: "মানির সাইকোলজি" },
    author: "Morgan Housel",
    category: { en: "Non-fiction", bn: "নন-ফিকশন" },
    tier: "prime",
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
    slug: "os-concepts",
    title: { en: "Operating System Concepts", bn: "অপারেটিং সিস্টেম কনসেপ্টস" },
    author: "Silberschatz, Galvin",
    category: { en: "Academic", bn: "একাডেমিক" },
    tier: "elite",
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
    slug: "himer-jole",
    title: { en: "Himur Ache Jol", bn: "হিমুর আছে জল" },
    author: "Humayun Ahmed",
    category: { en: "Fiction", bn: "উপন্যাস" },
    tier: "basic",
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
    slug: "atomic-habits",
    title: { en: "Atomic Habits", bn: "অ্যাটমিক হ্যাবিটস" },
    author: "James Clear",
    category: { en: "Self-help", bn: "সেলফ-হেল্প" },
    tier: "prime",
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
    slug: "design-patterns",
    title: { en: "Design Patterns", bn: "ডিজাইন প্যাটার্নস" },
    author: "Gamma, Helm, Johnson, Vlissides",
    category: { en: "Professional", bn: "পেশাগত" },
    tier: "elite",
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

const membersSeed = [
  {
    name: "Safayat Hossen Alif",
    email: "2024100010063@seu.edu.bd",
    studentId: "2024100010063",
    plan: "elite",
    status: "active",
    joined: "2026-01-15",
    books: 6,
  },
  {
    name: "Md. Samiul Haque",
    email: "2024100010069@seu.edu.bd",
    studentId: "2024100010069",
    plan: "prime",
    status: "active",
    joined: "2026-01-20",
    books: 4,
  },
  {
    name: "Md. Mustasin Billah",
    email: "2024100010074@seu.edu.bd",
    studentId: "2024100010074",
    plan: "basic",
    status: "active",
    joined: "2026-02-01",
    books: 2,
  },
  {
    name: "Sadik-Ul Haque",
    email: "captainsamiul@gmail.com",
    studentId: "2024100010080",
    plan: "prime",
    status: "active",
    joined: "2026-03-01",
    books: 5,
  },
  {
    name: "Ariyan Masrur",
    email: "ariyanmasrur31@gmail.com",
    studentId: "2024100010081",
    plan: "basic",
    status: "pending",
    joined: "2026-04-01",
    books: 1,
  },
  {
    name: "Sariot Hossain",
    email: "2024100010092@seu.edu.bd",
    studentId: "2024100010092",
    plan: "elite",
    status: "active",
    joined: "2026-04-10",
    books: 8,
  },
  {
    name: "Syed Abdullahil Galib",
    email: "princelunatic39@gmail.com",
    studentId: "2024100010082",
    plan: "prime",
    status: "expired",
    joined: "2025-12-01",
    books: 0,
  },
  {
    name: "MD Rubayet Hossain",
    email: "outtazimfind23@gmail.com",
    studentId: "2024100010083",
    plan: "prime",
    status: "active",
    joined: "2026-05-01",
    books: 3,
  },
];

function j(v: unknown) {
  return JSON.stringify(v);
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("Missing DATABASE_URL in .env");
    process.exit(1);
  }

  const parsed = parseDatabaseUrl(url);
  const { address } = await dns.promises.lookup(parsed.hostname, { family: 4 });
  const pool = new pg.Pool({
    host: address,
    port: parsed.port,
    user: parsed.user,
    password: parsed.password,
    database: parsed.database,
    ssl: { rejectUnauthorized: false, servername: parsed.hostname },
  });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const p of plans) {
      await client.query(
        `INSERT INTO plans (id, name, price, period, featured, blurb, features)
         VALUES ($1,$2::jsonb,$3,$4::jsonb,$5,$6::jsonb,$7::jsonb)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name, price = EXCLUDED.price, period = EXCLUDED.period,
           featured = EXCLUDED.featured, blurb = EXCLUDED.blurb, features = EXCLUDED.features`,
        [p.id, j(p.name), p.price, j(p.period), p.featured, j(p.blurb), j(p.features)],
      );
    }

    for (const b of books) {
      await client.query(
        `INSERT INTO books (slug, title, author, category, tier, pages, year, rating, copies, borrowed, summary, palette)
         VALUES ($1,$2::jsonb,$3,$4::jsonb,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title, author = EXCLUDED.author, category = EXCLUDED.category,
           tier = EXCLUDED.tier, pages = EXCLUDED.pages, year = EXCLUDED.year, rating = EXCLUDED.rating,
           copies = EXCLUDED.copies, borrowed = EXCLUDED.borrowed, summary = EXCLUDED.summary, palette = EXCLUDED.palette`,
        [
          b.slug,
          j(b.title),
          b.author,
          j(b.category),
          b.tier,
          b.pages,
          b.year,
          b.rating,
          b.copies,
          b.borrowed,
          j(b.summary),
          j(b.palette),
        ],
      );
    }

    const adminHash = await bcrypt.hash("admin123", 10);
    await client.query(
      `INSERT INTO users (email, student_id, password_hash, role, name, department)
       VALUES ($1,$2,$3,'ADMIN',$4,$5)
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash, role = 'ADMIN', name = EXCLUDED.name`,
      ["admin@seu.edu.bd", "ADMIN001", adminHash, "Safayat Alif", "CSE"],
    );

    await client.query("DELETE FROM payments");
    await client.query("DELETE FROM members");

    const studentHash = await bcrypt.hash("student123", 10);
    for (const m of membersSeed) {
      const userRes = await client.query<{ id: string }>(
        `INSERT INTO users (email, student_id, password_hash, role, name)
         VALUES ($1,$2,$3,'STUDENT',$4)
         ON CONFLICT (email) DO UPDATE SET
           password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, student_id = EXCLUDED.student_id
         RETURNING id`,
        [m.email, m.studentId, studentHash, m.name],
      );
      await client.query(
        `INSERT INTO members (user_id, name, email, plan_id, status, joined, books_count)
         VALUES ($1,$2,$3,$4,$5::member_status,$6,$7)`,
        [userRes.rows[0].id, m.name, m.email, m.plan, m.status, m.joined, m.books],
      );
    }

    const memberRows = await client.query<{ id: string; name: string; plan_id: string }>(
      "SELECT id, name, plan_id FROM members",
    );
    const byName = Object.fromEntries(memberRows.rows.map((r) => [r.name, r]));

    const payments = [
      { member: "Safayat Hossen Alif", amount: 150, method: "bKash", status: "paid", date: "2026-08-12" },
      { member: "Sariot Hossain", amount: 150, method: "Nagad", status: "paid", date: "2026-08-10" },
      { member: "Md. Samiul Haque", amount: 50, method: "Rocket", status: "paid", date: "2026-08-08" },
      { member: "Sadik-Ul Haque", amount: 50, method: "bKash", status: "paid", date: "2026-08-05" },
      { member: "Syed Abdullahil Galib", amount: 50, method: "Card", status: "failed", date: "2026-08-02" },
      { member: "MD Rubayet Hossain", amount: 50, method: "Nagad", status: "paid", date: "2026-08-01" },
    ];

    for (const p of payments) {
      const m = byName[p.member];
      if (!m) continue;
      await client.query(
        `INSERT INTO payments (member_id, plan_id, amount, method, status, paid_at)
         VALUES ($1,$2,$3,$4,$5::payment_status,$6)`,
        [m.id, m.plan_id, p.amount, p.method, p.status, p.date],
      );
    }

    await client.query("COMMIT");
    console.log("Seed complete.");
    console.log("Admin: admin@seu.edu.bd / admin123");
    console.log("Student: 2024100010063@seu.edu.bd / student123");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
