# Ethiopian Healthcare Management System — Public Homepage

Build only the homepage at `/`, matching the approved mockup. No backend, no other pages, no login, no booking.

## Sections (in this order)
1. **Header**: heart/cross logo with the brand name, links (Home is shown as active), Log In (outlined) and Register (filled). On mobile: hamburger menu with the links, Log In and Register buttons always visible, and the menu closes when you tap a link.
2. **Hero**: the eyebrow line, the headline with "when you need it." in teal, the supporting text, and two buttons: Find Hospitals and Create Account. A clinician-and-patient photo on the right, or below the text on mobile.
3. **Find a Hospital card**: pickers for City/Region and Department, a field for hospital name, and a Search Hospitals button. It checks that a city or department is chosen, then shows an honest message: "Search results are coming soon. Your filters: …". No made-up results.
4. **How It Works**: 3 numbered cards (search, choose appointment, manage bookings).
5. **Key Features**: 3 cards (appointments, patient dashboard, authorized medical history), using the exact copy from the brief.
6. **For Hospitals**: a light teal band with a hospital building photo on the left, the text on the right, and the Explore Hospital Partnership button.
7. **Final call to action**: a blue band with "Ready to get started?" and two buttons.
8. **Footer**: dark navy, the brand, four link groups (About, For Hospitals, Support, Legal), and a copyright line with the current year. No made-up social media accounts or email addresses.

## Pages that don't exist yet
Every link to a page not built yet (Find Hospitals, Login, Register, About and the others) opens one shared notice: "This page is coming in a future design phase." All planned page addresses sit in one central list so they're easy to connect later.

## Design
- Colors from the brief: primary blue #0866C2, navy #102A56, teal #008F91, light blue #F0F8FF, text #172B4D, muted text #64748B, borders #E2E8F0.
- Font: Plus Jakarta Sans for headings and Inter for body text. The brief allows "Inter or similar", and the mockup's headings are heavy and geometric.
- Rounded cards, soft shadows, gentle hover effects, and no extra animation.
- Two photos made with AI image generation: an East African clinician with a mother and child, and a modern hospital building. Neither shows real people's data or a real hospital's branding.

## Technical details
- Rewrite `src/routes/index.tsx` with its own title, description and social-sharing details. Fix the default "Lovable App" text in `__root.tsx` and add the font links there.
- Put the components in `src/components/home/*`, the menu list in `src/config/navigation.ts`, and the sample options in `src/data/search-options.ts`.
- Use the existing shadcn Select, Input, Button, Sheet (mobile menu) and Dialog (coming-soon notice). Use Sonner for the search message, mounted in the root layout.
- Add color tokens to `src/styles.css`.
- Add a small test that checks search validation (an empty search is blocked) and that the coming-soon notice opens for links to unbuilt pages.
