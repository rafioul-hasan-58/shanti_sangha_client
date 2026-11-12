import {
  AwardIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  UsersIcon,
  WalletIcon,
  type AdminNavIconComponent,
} from "@/components/admin/adminIcons";
import { locales } from "@/i18n/config";

export type NavStatus = "ready" | "cooking";

export type NavChild = {
  labelEn: string;
  labelBn: string;
  href: string;
  status: NavStatus;
};

export type NavItem = {
  id: string;
  labelEn: string;
  labelBn: string;
  shortLabelEn?: string;
  shortLabelBn?: string;
  icon: AdminNavIconComponent;
  href?: string;
  status?: NavStatus;
  children?: NavChild[];
};

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    labelEn: "Dashboard",
    labelBn: "ড্যাশবোর্ড",
    shortLabelEn: "Dashboard",
    shortLabelBn: "ড্যাশবোর্ড",
    icon: LayoutDashboardIcon,
    href: "/admin/dashboard",
    status: "ready",
  },
  {
    id: "committee",
    labelEn: "Committee",
    labelBn: "কার্যনির্বাহী কমিটি",
    shortLabelEn: "Committee",
    shortLabelBn: "কমিটি",
    icon: UsersIcon,
    children: [
      {
        labelEn: "All Committee Members",
        labelBn: "সকল কমিটি সদস্য",
        href: "/admin/committee",
        status: "ready",
      },
      {
        labelEn: "Add Member",
        labelBn: "নতুন সদস্য যোগ",
        href: "/admin/committee/new",
        status: "ready",
      },
      {
        labelEn: "Key Leaders",
        labelBn: "মূল নেতৃবৃন্দ",
        href: "/admin/committee/key-leaders",
        status: "cooking",
      },
      {
        labelEn: "Reorder Members",
        labelBn: "সদস্য ক্রম সাজান",
        href: "/admin/committee/reorder",
        status: "cooking",
      },
    ],
  },
  {
    id: "pioneers",
    labelEn: "Pioneers",
    labelBn: "অগ্রদূতগণ",
    shortLabelEn: "Pioneers",
    shortLabelBn: "অগ্রদূত",
    icon: AwardIcon,
    children: [
      {
        labelEn: "All Pioneers",
        labelBn: "সকল অগ্রদূত",
        href: "/admin/pioneers",
        status: "ready",
      },
      {
        labelEn: "Add Pioneer",
        labelBn: "নতুন অগ্রদূত যোগ",
        href: "/admin/pioneers/new",
        status: "ready",
      },
      {
        labelEn: "Reorder Pioneers",
        labelBn: "অগ্রদূত ক্রম সাজান",
        href: "/admin/pioneers/reorder",
        status: "cooking",
      },
    ],
  },
  {
    id: "admin",
    labelEn: "Admin Details",
    labelBn: "অ্যাডমিন তথ্য",
    shortLabelEn: "Admin",
    shortLabelBn: "অ্যাডমিন",
    icon: ShieldCheckIcon,
    children: [
      {
        labelEn: "My Profile",
        labelBn: "আমার প্রোফাইল",
        href: "/admin/profile",
        status: "ready",
      },
      {
        labelEn: "All Admins",
        labelBn: "সকল অ্যাডমিন",
        href: "/admin/admins",
        status: "cooking",
      },
      {
        labelEn: "Add Admin",
        labelBn: "নতুন অ্যাডমিন যোগ",
        href: "/admin/admins/new",
        status: "cooking",
      },
      {
        labelEn: "Roles & Permissions",
        labelBn: "রোল ও অনুমতি",
        href: "/admin/admins/roles",
        status: "cooking",
      },
      {
        labelEn: "Change Password",
        labelBn: "পাসওয়ার্ড পরিবর্তন",
        href: "/admin/profile/password",
        status: "ready",
      },
    ],
  },
  {
    id: "members",
    labelEn: "Members",
    labelBn: "ক্লাব সদস্য",
    icon: UserCheckIcon,
    href: "/admin/members",
    status: "cooking",
  },
  {
    id: "expenses",
    labelEn: "Expenses",
    labelBn: "ব্যয় হিসাব",
    icon: WalletIcon,
    href: "/admin/expenses",
    status: "cooking",
  },
];

/** The 4 primary mobile bottom bar tab IDs: Dashboard, Committee, Pioneers, Admin */
export const MOBILE_BOTTOM_TAB_IDS = [
  "dashboard",
  "committee",
  "pioneers",
  "admin",
] as const;

export const ADMIN_UI_COPY = {
  brandBn: "শান্তি সংঘ",
  brandEn: "Shanti Sangho",
  portalBn: "অ্যাডমিন পোর্টাল",
  portalEn: "Admin Portal",
  collapseLabelBn: "রেল মোড",
  collapseLabelEn: "Collapse",
  expandLabelBn: "বড় করুন",
  expandLabelEn: "Expand",
  homeLinkBn: "মূল পাতায় ফিরুন",
  homeLinkEn: "Back to Site",
  soonBadgeBn: "শীঘ্রই",
  soonBadgeEn: "Soon",
  closeSheetBn: "বন্ধ করুন",
  closeSheetEn: "Close",
  staticPageBadgeBn: "প্রস্তুত পেজ",
  staticPageBadgeEn: "Static Page",
  staticPageDescBn:
    "এই বিভাগটি কনফিগার করা হয়েছে এবং মূল ফিচার যুক্ত করার জন্য প্রস্তুত।",
  staticPageDescEn:
    "Static page ready for feature implementation.",
  cooking: {
    titleBn: "এই ফিচারটি এখন রান্না হচ্ছে 🍳",
    titleEn: "This feature is cooking right now",
    subtitleBn: "একটু অপেক্ষা করুন, খুব শীঘ্রই গরম গরম পরিবেশন করা হবে!",
    subtitleEn: "Hang tight, it will be served hot very soon!",
    progressBn: "প্রায় তৈরি…",
    progressEn: "Almost ready…",
    dashboardBtnBn: "ড্যাশবোর্ডে ফিরে যান",
    dashboardBtnEn: "Back to Dashboard",
    goBackBtnBn: "পেছনে যান",
    goBackBtnEn: "Go back",
  },
} as const;

export function stripLocalePrefix(pathname: string): string {
  for (const loc of locales) {
    if (pathname === `/${loc}`) return "/";
    if (pathname.startsWith(`/${loc}/`)) {
      return pathname.slice(loc.length + 1);
    }
  }
  return pathname;
}

export function withLocaleHref(href: string, locale: string): string {
  const normalized = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${normalized}`;
}

export function isAdminPathActive(pathname: string, href: string): boolean {
  const clean = stripLocalePrefix(pathname);
  if (href === "/admin/dashboard") {
    return clean === "/admin/dashboard" || clean === "/admin";
  }
  return clean === href;
}

export function findParentNavForPath(pathname: string): NavItem | undefined {
  const clean = stripLocalePrefix(pathname);
  return ADMIN_NAV_ITEMS.find((item) => {
    if (item.href && isAdminPathActive(clean, item.href)) return true;
    return item.children?.some((child) => isAdminPathActive(clean, child.href));
  });
}

export function findNavEntryByPath(pathname: string): {
  labelEn: string;
  labelBn: string;
  status: NavStatus;
  href: string;
  parent?: NavItem;
} | null {
  const clean = stripLocalePrefix(pathname);
  for (const item of ADMIN_NAV_ITEMS) {
    if (item.href && isAdminPathActive(clean, item.href)) {
      return {
        labelEn: item.labelEn,
        labelBn: item.labelBn,
        status: item.status ?? "ready",
        href: item.href,
      };
    }
    if (item.children) {
      for (const child of item.children) {
        if (isAdminPathActive(clean, child.href)) {
          return {
            labelEn: child.labelEn,
            labelBn: child.labelBn,
            status: child.status,
            href: child.href,
            parent: item,
          };
        }
      }
    }
  }
  return null;
}

