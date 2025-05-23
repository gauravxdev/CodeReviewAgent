# AI-Agent-Code-Review Project Guidelines

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npx convex dev` - Start Convex development server

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code with strict type checking
- Define explicit interfaces for component props and data models
- Use `Record<number, string>` for mapping types

### Imports/Exports
- Use named exports (`export function Component()`) for components
- Use path aliases with `@/` prefix (e.g., `@/components/ui/button`)
- Group and order imports by: React/Next.js, UI components, utilities

### Formatting
- Use 2-space indentation
- Use single quotes for string literals
- Use Tailwind for styling with className composition

### Components
- Use functional components with explicit type definitions
- Use destructured props with TypeScript interfaces
- Follow Radix UI component patterns for accessibility
- Limit console.log statements in production code