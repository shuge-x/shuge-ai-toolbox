## Context

The shuge AI Toolbox is a React + TypeScript application currently with two hardcoded routes (`/` and `*`). Tool definitions live in `src/tool-registry/catalog.ts` but the array is empty and the router does not read from it. The homepage (`Home.tsx`) renders static content with no tool cards.

The tech stack is React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, Vitest, and React Router 7.

## Goals / Non-Goals

**Goals:**
- Catalog is the single source of truth for all tool metadata (id, name, route, category, description, stage)
- Router generates routes dynamically from the catalog at module load time
- Planned tools render a placeholder page; active/beta tools render their component
- All pages share a Layout with TopNav navigation
- Homepage renders tool cards grouped by category
- Adding a new tool after this change requires only catalog registration + component creation

**Non-Goals:**
- This change does not implement any actual tool components (those come in subsequent changes)
- No authentication, no user preferences, no persistence layer
- No dynamic/staged catalog loading (catalog is a static module — changes require a rebuild)

## Decisions

### 1. ToolManifest.stage: "active" | "beta" | "planned"

**Decision:** Include `stage` on every tool entry with these semantics:
- `active` — fully implemented, routes to the tool's component
- `beta` — implemented but may have rough edges, routes to the tool's component (same as active from routing perspective)
- `planned` — not yet implemented, routes to `PlaceholderPage`

**Alternatives considered:**
- Using a boolean `isImplemented` flag. This conflates "in-progress" with "planned" and doesn't allow for a beta state where you want to ship but warn users.
- Omitting stage entirely and inferring it from whether a component file exists in `modules/`. This creates a hidden contract — routing depends on file presence — and makes it impossible to show planned tools on the homepage before the file exists.

**Rationale:** Stage is a first-class field because the catalog serves double duty: it's both a routing table and a product roadmap display. The homepage should show the full blueprint, not just what's shipped.

---

### 2. Catalog read at router build time, not runtime

**Decision:** The router calls `getTools()` once when the module is initialized (at build/dev time via the router config). Routes are static after that.

```
catalog.ts (module load)
    → router/index.tsx (getTools() called once, routes baked)
    → React Router handles runtime navigation
```

**Alternatives considered:**
- Runtime catalog loading (e.g., fetching catalog.json). Adds async complexity and a loading state that this app doesn't need yet.
- React Context providing catalog data to components. Unnecessary indirection — catalog is a plain data module, not a service.

**Rationale:** The catalog is code (TypeScript), not data. It lives in the same repository as the app and changes require a deploy anyway. Static resolution at build time keeps the architecture simple and tree-shakeable.

---

### 3. Layout wraps every route

**Decision:** The shared `Layout` component (TopNav + `<Outlet />`) is applied as a layout route in React Router 7, so all routes — including `/` (Home) — inherit it.

```
/           → Layout → Home
/tools/:id  → Layout → ToolComponent | PlaceholderPage
```

**Alternatives considered:**
- Only wrapping tool routes, not Home. This would break navigation consistency — users on a tool page couldn't easily jump to Home without seeing the same nav chrome.
- Making Layout a component rendered inside each page. Wastes a `<Layout>` wrapper in every view file.

**Rationale:** Layout is a navigation concern. Every page in a tool platform benefits from a persistent nav. If Home later needs a different treatment (e.g., a landing page with no nav), the Layout can be removed from that route — but for now, all pages share it.

---

### 4. Dynamic route generation with lazy-loaded components

**Decision:** For each tool in the catalog:
- If `stage === 'planned'`: route to `PlaceholderPage` component directly (no lazy load needed)
- If `stage === 'active' | 'beta'`: route using `React.lazy()` pointing to `../modules/${tool.id}/index.tsx`

A build-time validation step (via a script or ESLint rule) ensures every non-planned tool has a corresponding component file.

**Alternatives considered:**
- Eager imports for all tool components. Defeats code splitting — a platform with 20 tools would bundle all 20 components in the main chunk.
- No validation. A missing component file would produce a white screen at runtime with a cryptic error. Unacceptable.

**Rationale:** Code splitting is standard practice. The validation step closes the loop so developers get a clear error at build time if the catalog is out of sync with the filesystem.

---

### 5. Homepage grouped by category, sorted by stage then name

**Decision:** Home reads `getTools()` and renders tool cards grouped by `category`. Within each group, sort order is:
1. `active` first
2. `beta` second
3. `planned` third
4. Within each stage, alphabetical by `name`

**Alternatives considered:**
- Sort by name only. Doesn't surface which tools are ready vs. planned.
- Group by stage first, category second. Creates too many sections on the homepage and makes finding a category hard.

**Rationale:** The primary navigation concern is "what tools do I have?" grouped by what they do. Stage is secondary — it's the sub-sort key within each category.

---

### 6. PlaceholderPage for planned tools

**Decision:** The placeholder page is a static component that receives the `ToolManifest` via route params (`/tools/:id`). It renders:
- Tool name (h1)
- Tool description (p)
- "This tool is in planning" badge/callout
- "← Back to Home" link

**Rationale:** Planned tools deserve a thoughtful page, not a 404. This page confirms the tool exists in the catalog and tells the user it's not ready yet. It also serves as a hook for future features (e.g., "interested? give feedback" link).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Developer registers a tool in catalog but forgets to create the component file | Build-time validation script checks `modules/<id>/index.tsx` exists for all non-planned tools |
| Catalog has duplicate `id` values | Unit test in catalog.test.ts validates uniqueness of all tool ids |
| Category names diverge between catalog and Home | Single source of truth — catalog defines the categories; Home iterates `getTools()` grouped by `category` field |
| Many planned tools on homepage look like dead links | Planned tools show a distinct visual treatment (e.g., grayed card + "planned" badge) so users understand these are future states |

## Migration Plan

This change is purely additive — it adds new files and modifies existing ones but does not delete or migrate existing data.

1. Update `catalog.ts` with `stage` field and initial tool entries
2. Add `Layout` + `TopNav` components
3. Update `router/index.tsx` to be catalog-driven
4. Update `Home.tsx` to render category-grouped tool cards
5. Add `PlaceholderPage` component
6. Run `npx vitest run` to verify catalog accessor tests pass

No rollback needed — if something goes wrong, revert the change and the app returns to its previous two-static-route state.

## Open Questions

1. **Category governance**: When a new tool needs a new category, should that require a change proposal or is it a free-form field? Recommendation: free-form for now, but a lint rule warning if a category appears only once.
2. **Beta vs. active distinction**: Should beta tools show a "Beta" badge on the homepage? Yes — similar treatment to planned tools but with a distinct color.
3. **Tool icon/thumbnail**: Not in scope for v1, but worth noting as a future capability.
4. **Navigation structure**: TopNav is simple for now — logo left, links right. If more nav items are needed (e.g., search bar, user menu), the TopNav component can grow without affecting routing.