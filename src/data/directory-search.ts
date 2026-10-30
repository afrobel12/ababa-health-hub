export function validateDirectorySearch(search: Record<string, unknown>) {
  return {
    city: typeof search["city"] === "string" ? search["city"] : "",
    department: typeof search["department"] === "string" ? search["department"] : "",
    type: search["type"] === "public" || search["type"] === "private" ? search["type"] : "all",
    q: typeof search["q"] === "string" ? search["q"] : "",
    sort: typeof search["sort"] === "string" ? search["sort"] : "name-asc",
    view: typeof search["view"] === "string" ? search["view"] : "list",
    visible: typeof search["visible"] === "number" ? search["visible"] : 6,
  };
}
export const DIRECTORY_DEFAULTS = { city: "", department: "", type: "all", q: "", sort: "name-asc", view: "list", visible: 6 };