## Why

The shuge AI Toolbox needs a formal tool registry so tools can be catalog-driven: the catalog defines what tools exist, how they are grouped, and whether they are active or planned. Without this, every new tool requires manual routing, manual homepage updates, and no way to display a "roadmap" of planned tools. This change builds the infrastructure so adding a new tool is two steps—register it in the catalog and implement the component.

## What Changes

- **ToolManifest with stage field**: Tools have `stage` ("active" | "beta" | "planned") so the system knows which route to serve and how to display the tool on the homepage.
- **Catalog-driven routing**: The router reads `getTools()` from catalog.ts and generates routes for every registered tool. Planned tools route to a placeholder page; active/beta tools route to their implementation component.
- **Layout component**: Shared TopNav + content area so users can navigate from any tool page back to the homepage and to other tools.
- **Homepage categorization**: Home reads all tools from the catalog and renders them grouped by category.
- **Placeholder page**: Planned tools show a dedicated "in planning" page with tool name, description, and a back-to-home link.
- **Two-step tool addition**: After this change, adding a new tool only requires registering it in `catalog.ts` and creating a component under `modules/`.

## Capabilities

### New Capabilities

- **tool-registry**: The core system—catalog data structure, `getTools()` / `getToolById()` / `getToolsByCategory()` accessors, stage-aware routing, and homepage category grouping.
- **tool-placeholder**: A dedicated page rendered for any tool whose `stage` is "planned". Shows name, description, "in planning" notice, and a back-to-home link.
- **shared-layout**: A layout wrapper providing TopNav with logo and a content `<Outlet />`. All tool pages and the homepage share this layout.

### Modified Capabilities

*(none — no existing specs)*

## Impact

- **New files**: `src/tool-registry/catalog.ts` (updated), `src/layout/Layout.tsx`, `src/layout/TopNav.tsx`, `src/app/views/PlaceholderPage.tsx`
- **Modified files**: `src/router/index.tsx` (catalog-driven routes), `src/app/views/Home.tsx` (category-grouped tool cards)
- **Dependencies**: React Router 7 for dynamic routing; no new runtime dependencies
- **Testing**: Vitest unit tests for catalog accessors and stage-based routing logic