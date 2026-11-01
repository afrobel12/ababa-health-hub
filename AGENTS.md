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
