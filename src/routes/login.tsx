import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLoginPage } from "@/components/login/unified-login-page";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In | Ethiopian Healthcare Management System" },
      {
        name: "description",
        content: "One sign-in page for patients and hospital staff. A frontend design prototype with demo workspace previews.",
      },
      { property: "og:title", content: "Log in to your account" },
      { property: "og:description", content: "Unified login preview for patients and healthcare professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UnifiedLoginPage,
});
