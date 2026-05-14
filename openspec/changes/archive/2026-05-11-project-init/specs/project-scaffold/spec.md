## ADDED Requirements

### Requirement: Project scaffold structure
The system SHALL provide a standard directory structure for the AI Toolbox platform, including app/layouts, app/views, modules, router, lib, and tool-registry directories.

### Requirement: Tool manifest interface
The system SHALL define a ToolManifest interface in tool-registry/catalog.ts containing id, name, route, category, and description fields.

### Requirement: Tool registry query functions
The system SHALL provide getTools(), getToolById(id), and getToolsByCategory(category) query functions in tool-registry/catalog.ts.

### Requirement: Home page placeholder
The system SHALL render a Home page at route / displaying the project name and a tool list placeholder area.

### Requirement: 404 fallback route
The system SHALL render a NotFound page for any unmatched route.

### Requirement: OpenSpec workflow configuration
The system SHALL have OpenSpec config.yaml, schema fork, and review template configured.

### Requirement: GitHub repository initialization
The system SHALL be initialized as a Git repository and pushed to the public GitHub repository shuge-ai-toolbox.