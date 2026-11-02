<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Hospital details resolve the existing hospital dataset; separate doctor records and deterministic demo availability utilities must preserve hospital/department relationships.
- Use an un-nested dynamic hospital route beside the directory leaf so the existing directory route and hooks remain stable.
- Keep directory filters, view, sorting and pagination in validated URL state, and keep appointment choices only in local React state.
- Supporting public pages wrap content in the shared PublicPageShell (header/footer/coming-soon provider) so navigation stays consistent; `/for-hospitals` uses an index leaf with a sibling `apply` leaf (no layout file) so neither needs an Outlet.
- Demo forms (hospital application, contact) keep values only in component state and clear them on submit, so leaving the route discards everything.
- Patient screens live under the `/patient` layout route (`patient.tsx` renders PatientWorkspaceLayout + Outlet; leaves like `patient.index.tsx`) so future P-02..P-07 reuse one shell; all patient nav comes from `src/config/patient-navigation.ts` so desktop and mobile never diverge.
- Date-relative demo data (patient appointments, notifications, history) is built from one `now` captured after hydration (`useDemoNow`), formatted in Africa/Addis_Ababa, so SSR never mismatches and derived figures stay consistent.
- The shared coming-soon notice has no Radix trigger, so it records and restores the focused element itself; menus queue a notice and open it from their onCloseAutoFocus to avoid overlapping layers.
