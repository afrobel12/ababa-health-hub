// Central list of public routes. `implemented: false` routes open the
// "coming soon" notice instead of navigating, until those pages are built.
export type NavTarget = { label: string; href: string; implemented: boolean };

export const routes = {
  home: { label: "Home", href: "/", implemented: true },
  hospitals: { label: "Find Hospitals", href: "/hospitals", implemented: true },
  forHospitals: { label: "For Hospitals", href: "/for-hospitals", implemented: false },
  about: { label: "About", href: "/about", implemented: false },
  contact: { label: "Contact", href: "/contact", implemented: false },
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
      { label: "About the Platform", href: "/about", implemented: false },
      { label: "Our Mission", href: "/about#mission", implemented: false },
    ],
  },
  {
    title: "For Hospitals",
    links: [
      { label: "Hospital Partnership", href: "/for-hospitals", implemented: false },
      { label: "Apply to Join", href: "/for-hospitals/apply", implemented: false },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help", implemented: false },
      { label: "Contact Us", href: "/contact", implemented: false },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy", implemented: false },
      { label: "Terms of Service", href: "/terms", implemented: false },
    ],
  },
];
