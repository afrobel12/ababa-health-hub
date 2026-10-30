import { createFileRoute } from "@tanstack/react-router";
import { AccountRecoveryPage } from "@/components/recovery/account-recovery-page";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Account Recovery | Ethiopian Healthcare Management System" },
      {
        name: "description",
        content:
          "Recover your account in four steps: phone number, demonstration verification code, new password and confirmation. A frontend design prototype.",
      },
      { property: "og:title", content: "Recover your account securely" },
      {
        property: "og:description",
        content: "A four-step account recovery preview for the Ethiopian Healthcare Management System.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountRecoveryPage,
});
