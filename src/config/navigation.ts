// Central list of public routes. `implemented: false` routes open the
// "coming soon" notice instead of navigating, until those pages are built.
export type NavTarget = { label: string; href: string; implemented: boolean; hash?: string };

export const routes = {
  home: { label: "Home", href: "/", implemented: true },
  hospitals: { label: "Find Hospitals", href: "/hospitals", implemented: true },
  forHospitals: { label: "For Hospitals", href: "/for-hospitals", implemented: true },
  hospitalApply: { label: "Apply to Join", href: "/for-hospitals/apply", implemented: true },
  about: { label: "About", href: "/about", implemented: true },
  contact: { label: "Contact", href: "/contact", implemented: true },
  privacy: { label: "Privacy Policy", href: "/privacy", implemented: true },
  terms: { label: "Terms of Service", href: "/terms", implemented: true },
  help: { label: "Help Center", href: "/help", implemented: false },
  login: { label: "Log In", href: "/login", implemented: true },
  register: { label: "Register", href: "/register", implemented: true },
} satisfies Record<string, NavTarget>;

export const mainNav: NavTarget[] = [
  routes.home,
  routes.hospitals,
  routes.forHospitals,
  routes.about,
  routes.contact,
];

export const footerNav: { title: string; links: NavTarget[] }[] = [
  {
    title: "About",
    links: [
      { ...routes.about, label: "About the Platform" },
      { ...routes.about, label: "Our Mission", hash: "mission" },
    ],
  },
  {
    title: "For Hospitals",
    links: [{ ...routes.forHospitals, label: "Hospital Partnership" }, routes.hospitalApply],
  },
  {
    title: "Support",
    links: [routes.help, { ...routes.contact, label: "Contact Us" }],
  },
  {
    title: "Legal",
    links: [routes.privacy, routes.terms],
  },
];
