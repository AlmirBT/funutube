export type UserRole = "admin" | "youtuber";
export const currentUser = {
  role: "youtuber" as UserRole,
  domains: ["fonix.funtime.su"],
};

export type PurchaseType = "privileges" | "promotions" | "cases" | "tokens" | "services" | "subscription";
export type PurchaseStatus = "completed" | "pending" | "refunded" | "failed";

export interface Purchase {
  id: string;
  username: string;
  nickname: string;
  domain: string;
  type: PurchaseType;
  amount: number;
  currency: string;
  date: string;
  status: PurchaseStatus;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  purchases: number;
  subscriptions?: number;
  newPlayers?: number;
  totalUsersPassed?: number;
  usersOnline?: number;
  compareRevenue?: number;
  comparePurchases?: number;
}

export interface TopPurchase {
  id: string;
  username: string;
  amount: number;
  type: PurchaseType;
  name: string;
  count: number;
  sharePercent: number;
}

export interface TopUser {
  username: string;
  totalSpent: number;
  purchaseCount: number;
  sparkline: number[];
}

export interface TopVideoByRevenue {
  id: string;
  title: string;
  revenue: number;
  views: number;
  sparkline: number[];
}

export interface DomainStats {
  domain: string;
  revenue: number;
  attractedUsers: number;
  conversion: number;
  subdomains?: DomainStats[];
}

export interface SubscriptionsStats {
  count: number;
  growthPercent: number;
  sparkline: number[];
}

export const kpiStats = {
  revenueToday: 145,
  revenueTodayDelta: 12.4,
  revenueYesterdaySameTime: 129,
  revenueThisWeek: 920,
  revenueThisWeekDelta: 18.2,
  revenueThisMonth: 4200,
  revenueThisMonthDelta: 24.8,
  attractedUsersWeek: 2089,
  attractedUsersWeekDelta: 12.5,
  revenueByDomain: 820,
  revenueByDomainDelta: 8.2,
  domainConversion: 18.2,
};

export const kpiSparklines: Record<string, number[]> = {
  today: [98, 112, 108, 125, 132, 140, 145],
  yesterday: [88, 102, 98, 115, 122, 125, 129],
  week: [720, 765, 800, 835, 865, 892, 920],
  month: [3580, 3720, 3850, 3980, 4080, 4150, 4200],
};

export const kpiContext: Record<string, string> = {
  today: "Лучший показатель за эту неделю",
  yesterday: "Вчера в это же время",
  week: "Лучшая неделя за месяц",
  month: "Рост к прошлому месяцу +24.8%",
  attractedUsers: "Привлечённые игроки за неделю по домену",
  revenueByDomain: "Доход по вашему домену",
};

const now = new Date(MOCK_NOW);
const chartDates: ChartDataPoint[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(now);
  d.setDate(d.getDate() - (13 - i));
  const day = d.toISOString().slice(0, 10);
  const baseRev = 95 + Math.sin(i * 0.5) * 35 + (i * 4);
  const basePurchases = 3 + (i % 5) + Math.floor(i / 4);
  const baseNew = 2 + (i % 4) + Math.floor(i / 5);
  const baseTotal = 50 + i * 8 + (i % 3) * 5;
  const baseOnline = 1200 + Math.sin(i * 0.3) * 300 + i * 20;
  return {
    date: day,
    revenue: Math.round(baseRev),
    purchases: basePurchases,
    newPlayers: baseNew,
    totalUsersPassed: baseTotal,
    usersOnline: Math.round(baseOnline),
    compareRevenue: Math.round(baseRev * 0.85),
    comparePurchases: Math.max(2, basePurchases - 2),
  };
});

export const chartData: ChartDataPoint[] = chartDates;

const firstNames = ["Alex", "Jordan", "Sam", "Taylor", "Casey", "Riley", "Morgan", "Quinn", "Avery", "Reese"];
const lastNames = ["Smith", "Lee", "Kim", "Brown", "Garcia", "Wilson", "Chen", "Davis", "Martinez", "Jones"];
const domainSlugs = ["fonix", "aqua", "fokus1", "nefort", "nsai", "kast", "hardy", "honey", "aks", "anim", "flerni", "garou"];
function slugToDomain(slug: string): string {
  return `${slug}.funtime.su`;
}
const statuses: PurchaseStatus[] = ["completed", "completed", "completed", "pending", "refunded", "failed"];
const types: PurchaseType[] = ["privileges", "promotions", "cases", "tokens", "services", "subscription"];

function at<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function dateByIndex(i: number, daysBack: number): string {
  const d = new Date(MOCK_NOW);
  d.setDate(d.getDate() - (i % daysBack));
  return d.toISOString();
}

export const purchases: Purchase[] = Array.from({ length: 48 }, (_, i) => {
  const first = at(firstNames, i);
  const last = at(lastNames, i * 7);
  const username = `${first.toLowerCase()}.${last.toLowerCase()}${i % 5}`;
  const amount = 0.4 + (i * 0.25) % 4.5 + (i % 4) * 0.05;
  const slug = at(domainSlugs, i);
  return {
    id: `pur-${1000 + i}`,
    username,
    nickname: `${first} ${last}`,
    domain: slugToDomain(slug),
    type: at(types, i),
    amount: Math.round(amount * 100) / 100,
    currency: "USD",
    date: dateByIndex(i, 30),
    status: at(statuses, i),
  };
});

purchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const typeLabelsShort: Record<PurchaseType, string> = {
  privileges: "Привилегии",
  promotions: "Акции",
  cases: "Кейсы",
  tokens: "Токены",
  services: "Услуги",
  subscription: "Подписка",
};

const rawTopPurchases = [
  { id: "1", username: "huesos лютый1", amount: 7.9, type: "subscription" as PurchaseType },
  { id: "2", username: "jordan.lee", amount: 4.9, type: "services" as PurchaseType },
  { id: "3", username: "taylor.kim", amount: 3.9, type: "cases" as PurchaseType },
  { id: "4", username: "casey.brown", amount: 2.9, type: "privileges" as PurchaseType },
  { id: "5", username: "morgan.wilson", amount: 1.9, type: "tokens" as PurchaseType },
];

const totalRevenueTop = rawTopPurchases.reduce((s, p) => s + p.amount, 0);

export const topPurchases: TopPurchase[] = rawTopPurchases.map((p, i) => ({
  ...p,
  name: typeLabelsShort[p.type],
  count: 5 - i,
  sharePercent: Math.round((p.amount / totalRevenueTop) * 100),
}));

export const topUsers: TopUser[] = [
  { username: "alex.smith2", totalSpent: 35, purchaseCount: 8, sparkline: [12, 19, 8, 24, 18, 22, 28] },
  { username: "jordan.lee", totalSpent: 24, purchaseCount: 5, sparkline: [8, 14, 10, 16, 12, 18, 14] },
  { username: "taylor.kim", totalSpent: 20, purchaseCount: 6, sparkline: [6, 10, 14, 8, 16, 12, 10] },
  { username: "casey.brown", totalSpent: 17, purchaseCount: 4, sparkline: [4, 8, 6, 12, 8, 10, 6] },
  { username: "riley.garcia", totalSpent: 14, purchaseCount: 3, sparkline: [2, 6, 8, 4, 10, 6, 8] },
];

export const topVideosByRevenue: TopVideoByRevenue[] = [
  { id: "v1", title: "Как я заработал первый миллион на стримах", revenue: 32, views: 89200, sparkline: [3, 5, 6, 5, 4, 5, 6] },
  { id: "v2", title: "Разбор донатов и суперчатов за месяц", revenue: 22, views: 45600, sparkline: [2, 3, 3.5, 3, 3.5, 4, 4] },
  { id: "v3", title: "Стрим 24ч — челлендж", revenue: 15, views: 31200, sparkline: [1.5, 2, 2.5, 2, 2, 2.5, 3] },
  { id: "v4", title: "Коллаб с блогером X", revenue: 12, views: 27800, sparkline: [1, 1.5, 2, 1.5, 2, 2, 2.5] },
  { id: "v5", title: "Q&A подписчиков", revenue: 8, views: 18900, sparkline: [0.5, 1, 1.2, 1, 1.2, 1.4, 2] },
];

export interface OfficialYouTuber {
  name: string;
  youtubeUrl: string;
  joinDate: string;
}
export const officialYouTubersList: OfficialYouTuber[] = [
  { name: "FONIX", youtubeUrl: "https://www.youtube.com/@fonix5890", joinDate: "18 октября 2022 года" },
  { name: "Akvi4", youtubeUrl: "https://www.youtube.com/@akvi4", joinDate: "28 октября 2022 года" },
  { name: "Fokus1", youtubeUrl: "https://www.youtube.com/@fokus1311", joinDate: "23 декабря 2022 года" },
  { name: "Нефорт", youtubeUrl: "https://www.youtube.com/@NeFort", joinDate: "05 января 2023 года" },
  { name: "NSAI", youtubeUrl: "https://www.youtube.com/@НСАЙ", joinDate: "10 сентября 2023 года" },
  { name: "KastroomXD", youtubeUrl: "https://www.youtube.com/@kastroom1", joinDate: "12 сентября 2023 года" },
  { name: "_Dane4ka_", youtubeUrl: "https://www.youtube.com/@Dane4kaHardyyy", joinDate: "11 февраля 2024 года" },
  { name: "Honey", youtubeUrl: "https://www.youtube.com/@Honey_l1fe", joinDate: "11 февраля 2024 года" },
  { name: "Акс", youtubeUrl: "https://www.youtube.com/@Ax8ezki", joinDate: "29 января 2025 года" },
  { name: "Анимчик", youtubeUrl: "https://www.youtube.com/@Anim4ikFunTime", joinDate: "14 июня 2025 года" },
  { name: "Флерни", youtubeUrl: "https://www.youtube.com/@FLERNI", joinDate: "14 июня 2025 года" },
  { name: "Garou", youtubeUrl: "https://www.youtube.com/@GarouFunTime", joinDate: "27 сентября 2025 года" },
];

export const youtuberDomain = {
  domain: "piona.funtime.su",
  description: "Ваш домен для привлечения игроков. Трафик и регистрации по этому домену.",
};

export const domainsData: DomainStats[] = [
  { domain: "fonix.funtime.su", revenue: 820, attractedUsers: 4200, conversion: 18.2, subdomains: [{ domain: "fx.funtime.su", revenue: 185, attractedUsers: 2150, conversion: 16.8 }] },
  { domain: "aqua.funtime.su", revenue: 645, attractedUsers: 3800, conversion: 16.1, subdomains: [{ domain: "aq.funtime.su", revenue: 142, attractedUsers: 2050, conversion: 15.2 }] },
  { domain: "fokus1.funtime.su", revenue: 588, attractedUsers: 3200, conversion: 15.4, subdomains: [{ domain: "fk.funtime.su", revenue: 128, attractedUsers: 2080, conversion: 14.1 }] },
  { domain: "nefort.funtime.su", revenue: 512, attractedUsers: 2850, conversion: 14.8, subdomains: [{ domain: "nf.funtime.su", revenue: 108, attractedUsers: 2040, conversion: 13.5 }] },
  { domain: "nsai.funtime.su", revenue: 428, attractedUsers: 2450, conversion: 13.2, subdomains: [{ domain: "ns.funtime.su", revenue: 92, attractedUsers: 2030, conversion: 12.2 }] },
  { domain: "kast.funtime.su", revenue: 365, attractedUsers: 2180, conversion: 12.5, subdomains: [{ domain: "ka.funtime.su", revenue: 78, attractedUsers: 2020, conversion: 11.8 }] },
  { domain: "hardy.funtime.su", revenue: 298, attractedUsers: 2165, conversion: 11.8, subdomains: [{ domain: "hd.funtime.su", revenue: 62, attractedUsers: 2010, conversion: 10.9 }] },
  { domain: "honey.funtime.su", revenue: 275, attractedUsers: 2152, conversion: 11.2, subdomains: [{ domain: "hn.funtime.su", revenue: 58, attractedUsers: 2008, conversion: 10.5 }] },
  { domain: "aks.funtime.su", revenue: 218, attractedUsers: 2118, conversion: 10.5, subdomains: [{ domain: "ak.funtime.su", revenue: 46, attractedUsers: 2005, conversion: 9.8 }] },
  { domain: "anim.funtime.su", revenue: 168, attractedUsers: 2092, conversion: 9.8, subdomains: [{ domain: "an.funtime.su", revenue: 35, attractedUsers: 2003, conversion: 9.2 }] },
  { domain: "flerni.funtime.su", revenue: 142, attractedUsers: 2078, conversion: 9.2, subdomains: [{ domain: "fl.funtime.su", revenue: 28, attractedUsers: 2002, conversion: 8.6 }] },
  { domain: "garou.funtime.su", revenue: 98, attractedUsers: 2052, conversion: 8.4, subdomains: [{ domain: "gr.funtime.su", revenue: 18, attractedUsers: 2000, conversion: 7.9 }] },
];

export const subscriptionsCount = 52;

export const subscriptionsStats: SubscriptionsStats = {
  count: subscriptionsCount,
  growthPercent: 14.8,
  sparkline: [44, 46, 48, 47, 49, 51, 52],
};

export const activeSubscribersByDomain = 9;
export const activeSubscribersByDomainSparkline = [7, 7, 8, 7, 8, 8, 9];

export const revenueByTimeOfDay = {
  morning: 28,
  day: 38,
  evening: 58,
  night: 13,
};

export const revenueForecast = {
  day: 158,
  week: 1050,
};

export const levelConfig = {
  currentLevel: 4,
  progressPercent: 67,
  nextLevelAt: "50 000 ₽",
};

export interface Achievement {
  id: string;
  title: string;
  unlocked: boolean;
}
export const achievements: Achievement[] = [
  { id: "first1k", title: "Первые 500 ₽", unlocked: true },
  { id: "first10k", title: "Первые 5 000 ₽", unlocked: true },
  { id: "100purchases", title: "30 покупок за день", unlocked: false },
  { id: "bestDay", title: "Лучший день месяца", unlocked: true },
  { id: "weekStreak", title: "Неделя роста подряд", unlocked: false },
];

export const newVsReturning = {
  newPercent: 38,
  returningPercent: 62,
};

export interface Recommendation {
  id: string;
  title: string;
  subtitle: string;
}
export const recommendations: Recommendation[] = [
  { id: "video", title: "Выпускайте ролики вечером", subtitle: "18–24 ч — пик покупок" },
  { id: "domain", title: "Используйте свой домен в описании и стримах", subtitle: "Трафик по домену — привлечённые игроки и доход" },
  { id: "format", title: "Стримы продают лучше", subtitle: "Формат «стрим» даёт +24% к среднему чеку" },
];

export interface YouTuberStats {
  id: string;
  name: string;
  domain: string;
  isOfficial: boolean;
  revenueDay: number;
  revenueWeek: number;
  revenueMonth: number;
  purchasesCount: number;
  conversion: number;
  attractedUsers: number;
  level: number;
  sparkline: number[];
}

export const currentYouTuberStats: YouTuberStats = {
  id: "me",
  name: "piona",
  domain: youtuberDomain.domain,
  isOfficial: true,
  revenueDay: kpiStats.revenueToday,
  revenueWeek: kpiStats.revenueThisWeek,
  revenueMonth: kpiStats.revenueThisMonth,
  purchasesCount: 28,
  conversion: kpiStats.domainConversion,
  attractedUsers: kpiStats.attractedUsersWeek,
  level: levelConfig.currentLevel,
  sparkline: kpiSparklines.week,
};

export const otherYouTubersStats: YouTuberStats[] = [
  { id: "fonix", name: "FONIX", domain: "fonix.funtime.su", isOfficial: true, revenueDay: 185, revenueWeek: 1280, revenueMonth: 5200, purchasesCount: 186, conversion: 18.2, attractedUsers: 4200, level: 5, sparkline: [280, 305, 320, 335, 345, 355, 365] },
  { id: "aqua", name: "Akvi4", domain: "aqua.funtime.su", isOfficial: true, revenueDay: 150, revenueWeek: 1050, revenueMonth: 4280, purchasesCount: 152, conversion: 16.1, attractedUsers: 3800, level: 5, sparkline: [220, 242, 258, 272, 285, 298, 310] },
  { id: "fokus1", name: "Fokus1", domain: "fokus1.funtime.su", isOfficial: true, revenueDay: 132, revenueWeek: 920, revenueMonth: 3680, purchasesCount: 134, conversion: 15.4, attractedUsers: 3200, level: 4, sparkline: [185, 202, 218, 232, 245, 258, 270] },
  { id: "nefort", name: "Нефорт", domain: "nefort.funtime.su", isOfficial: true, revenueDay: 114, revenueWeek: 798, revenueMonth: 3180, purchasesCount: 118, conversion: 14.8, attractedUsers: 2850, level: 4, sparkline: [162, 178, 192, 205, 218, 228, 238] },
  { id: "nsai", name: "NSAI", domain: "nsai.funtime.su", isOfficial: true, revenueDay: 94, revenueWeek: 658, revenueMonth: 2620, purchasesCount: 98, conversion: 13.2, attractedUsers: 2450, level: 4, sparkline: [132, 148, 162, 175, 188, 198, 208] },
  { id: "kast", name: "KastroomXD", domain: "kast.funtime.su", isOfficial: true, revenueDay: 78, revenueWeek: 548, revenueMonth: 2180, purchasesCount: 86, conversion: 12.5, attractedUsers: 2180, level: 3, sparkline: [108, 122, 135, 148, 158, 168, 178] },
  { id: "hardy", name: "_Dane4ka_", domain: "hardy.funtime.su", isOfficial: true, revenueDay: 64, revenueWeek: 448, revenueMonth: 1780, purchasesCount: 72, conversion: 11.8, attractedUsers: 2165, level: 3, sparkline: [88, 98, 108, 118, 128, 138, 148] },
  { id: "honey", name: "Honey", domain: "honey.funtime.su", isOfficial: true, revenueDay: 60, revenueWeek: 418, revenueMonth: 1650, purchasesCount: 68, conversion: 11.2, attractedUsers: 2152, level: 3, sparkline: [82, 92, 100, 108, 118, 126, 135] },
  { id: "aks", name: "Акс", domain: "aks.funtime.su", isOfficial: true, revenueDay: 47, revenueWeek: 328, revenueMonth: 1300, purchasesCount: 54, conversion: 10.5, attractedUsers: 2118, level: 3, sparkline: [62, 72, 80, 88, 96, 104, 112] },
  { id: "anim", name: "Анимчик", domain: "anim.funtime.su", isOfficial: true, revenueDay: 37, revenueWeek: 258, revenueMonth: 1020, purchasesCount: 42, conversion: 9.8, attractedUsers: 2092, level: 2, sparkline: [48, 56, 64, 72, 78, 84, 90] },
  { id: "flerni", name: "Флерни", domain: "flerni.funtime.su", isOfficial: true, revenueDay: 31, revenueWeek: 218, revenueMonth: 858, purchasesCount: 38, conversion: 9.2, attractedUsers: 2078, level: 2, sparkline: [40, 48, 54, 60, 66, 72, 78] },
  { id: "garou", name: "Garou", domain: "garou.funtime.su", isOfficial: true, revenueDay: 21, revenueWeek: 148, revenueMonth: 585, purchasesCount: 28, conversion: 8.4, attractedUsers: 2052, level: 2, sparkline: [26, 32, 38, 42, 48, 52, 58] },
];

export const allYouTubersForRanking: YouTuberStats[] = [currentYouTuberStats, ...otherYouTubersStats];

export const averageYouTuberStats = {
  revenueDay: Math.round(otherYouTubersStats.reduce((s, u) => s + u.revenueDay, 0) / otherYouTubersStats.length),
  revenueWeek: Math.round(otherYouTubersStats.reduce((s, u) => s + u.revenueWeek, 0) / otherYouTubersStats.length),
  revenueMonth: Math.round(otherYouTubersStats.reduce((s, u) => s + u.revenueMonth, 0) / otherYouTubersStats.length),
  purchasesCount: Math.round(otherYouTubersStats.reduce((s, u) => s + u.purchasesCount, 0) / otherYouTubersStats.length),
  conversion: Number((otherYouTubersStats.reduce((s, u) => s + u.conversion, 0) / otherYouTubersStats.length).toFixed(1)),
  attractedUsers: Math.round(otherYouTubersStats.reduce((s, u) => s + u.attractedUsers, 0) / otherYouTubersStats.length),
};

export const domainFilterOptions: string[] = domainsData.flatMap((d) => [d.domain, ...(d.subdomains ?? []).map((s) => s.domain)]);

export function findDomainStats(domain: string): { main: DomainStats; current: DomainStats } | null {
  for (const main of domainsData) {
    if (main.domain === domain) return { main, current: main };
    const sub = main.subdomains?.find((s) => s.domain === domain);
    if (sub) return { main, current: sub };
  }
  return null;
}
import { MOCK_NOW } from "./dateUtils";
