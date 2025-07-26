# Claude Code Guidelines for Fabl
## Implementation Best Practices

### 0 — Purpose  

These rules ensure maintainability, safety, and developer velocity for the Fabl monorepo. 
**MUST** rules are enforced by CI; **SHOULD** rules are strongly recommended.

---

### 1 — Before Coding

- **BP-1 (MUST)** Ask the user clarifying questions before implementing features.
- **BP-2 (SHOULD)** Draft and confirm an approach for complex work, especially cross-app features.  
- **BP-3 (SHOULD)** If ≥ 2 approaches exist, list clear pros and cons considering Hub/Studio separation.

---

### 2 — While Coding

- **C-1 (MUST)** Follow existing patterns in Hub and Studio apps (Next.js App Router conventions).
- **C-2 (MUST)** Name components and functions consistently with existing domain vocabulary.  
- **C-3 (SHOULD NOT)** Create new components when existing UI components (Shadcn/ui) suffice.  
- **C-4 (SHOULD)** Prefer React hooks and server components where appropriate.
- **C-5 (MUST)** Use proper TypeScript types from shared packages
  ```ts
  import type { User, Video } from '@fabl/types'   // ✅ Good
  type User = { id: string, ... }                  // ❌ Bad
  ```  
- **C-6 (MUST)** Use `import type { … }` for type-only imports.
- **C-7 (SHOULD NOT)** Add comments except for critical caveats; rely on self‑explanatory code.
- **C-8 (SHOULD)** Default to `type`; use `interface` only for component props or when extending. 
- **C-9 (SHOULD NOT)** Extract a new component unless it will be reused, improves testability, or significantly improves readability.

---

### 3 — Testing

- **T-1 (MUST)** For React components, colocate tests in `__tests__` directory.
- **T-2 (MUST)** For API routes, add integration tests in `/apps/api/test/*.spec.ts`.
- **T-3 (MUST)** Separate pure component tests from API integration tests.
- **T-4 (SHOULD)** Use React Testing Library for component tests.  
- **T-5 (SHOULD)** Test user interactions, not implementation details.
- **T-6 (SHOULD)** Test the entire rendered output in one assertion if possible
  ```ts
  expect(screen.getByText('Upload Video')).toBeInTheDocument() // Good
  
  const button = screen.getByRole('button'); // Bad
  expect(button).toBeInTheDocument(); // Bad
  expect(button.textContent).toBe('Upload Video'); // Bad
  ```

---

### 4 — Database

- **D-1 (MUST)** Use Prisma types from `@fabl/db` package.  
- **D-2 (SHOULD)** Handle database operations in API routes or server actions, never in client components.
- **D-3 (MUST)** Use transactions for multi-table operations.

---

### 5 — Code Organization

- **O-1 (MUST)** Place code in `/packages/` only if used by both Hub and Studio.
- **O-2 (MUST)** Keep Hub-specific code in `/apps/hub`, Studio-specific in `/apps/studio`.
- **O-3 (SHOULD)** Use the following structure:
  ```
  /apps/hub/src/
    /app/          # Next.js app router pages
    /components/   # React components
    /hooks/        # Custom React hooks
    /lib/          # Utilities
    /api/          # BFF API routes
  ```
- **O-4 (MUST)** Follow Next.js 15 App Router conventions for file naming.

---

### 6 — UI Components

- **UI-1 (MUST)** Use existing Shadcn/ui components before creating new ones.
- **UI-2 (MUST)** Maintain consistent styling with Tailwind classes.
- **UI-3 (SHOULD)** Use Framer Motion for complex animations.
- **UI-4 (SHOULD NOT)** Add inline styles unless absolutely necessary.

---

### 7 — State Management

- **S-1 (MUST)** Use React Query for server state in both Hub and Studio.
- **S-2 (SHOULD)** Keep component state local unless needed elsewhere.
- **S-3 (SHOULD)** Use URL state for filters, pagination, and shareable UI state.
- **S-4 (MUST)** Handle loading, error, and empty states for all data fetching.

---

### 8 — Authentication & Security

- **A-1 (MUST)** Validate authentication in middleware or server components.
- **A-2 (MUST)** Never expose sensitive data in client components.
- **A-3 (SHOULD)** Use environment variables for all configuration.
- **A-4 (MUST)** Implement proper CORS for cross-app communication.

---

### 9 — Performance

- **P-1 (SHOULD)** Use Next.js Image component for all images.
- **P-2 (SHOULD)** Implement proper code splitting with dynamic imports.
- **P-3 (MUST)** Add loading.tsx files for route segments.
- **P-4 (SHOULD)** Use React.memo sparingly and only when proven necessary.

---

### 10 — Tooling Gates

- **G-1 (MUST)** `npm run lint` passes in all apps.  
- **G-2 (MUST)** `npm run typecheck` passes.
- **G-3 (MUST)** All tests pass before committing.

---

### 11 - Git

- **GH-1 (MUST)** Use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- **GH-2 (SHOULD NOT)** Refer to Claude or Anthropic in commit messages.
- **GH-3 (SHOULD)** Prefix commits with app name when changing app-specific code:
  ```
  feat(hub): add video upload button
  fix(studio): correct analytics chart rendering
  feat(api): implement video moderation endpoint
  ```

---

## Writing Functions Best Practices

When evaluating whether a function you implemented is good or not, use this checklist:

1. Can you read the function and HONESTLY easily follow what it's doing? If yes, then stop here.
2. Does the function have very high cyclomatic complexity? (number of independent paths, or, in a lot of cases, number of nesting if if-else as a proxy). If it does, then it's probably sketchy.
3. Are there any common data structures and algorithms that would make this function much easier to follow and more robust? Parsers, trees, stacks / queues, etc.
4. Are there any unused parameters in the function?
5. Are there any unnecessary type casts that can be moved to function arguments?
6. Is the function easily testable without mocking core features (e.g. Prisma queries, Redis, Mux API)? If not, can this function be tested as part of an integration test?
7. Does it have any hidden untested dependencies or any values that can be factored out into the arguments instead? Only care about non-trivial dependencies that can actually change or affect the function.
8. Brainstorm 3 better function names and see if the current name is the best, consistent with rest of codebase.

IMPORTANT: you SHOULD NOT refactor out a separate function unless there is a compelling need, such as:
  - the refactored function is used in more than one place
  - the refactored function is easily unit testable while the original function is not AND you can't test it any other way
  - the original function is extremely hard to follow and you resort to putting comments everywhere just to explain it

---

## Writing Components Best Practices

When evaluating whether a React component is well-written:

1. Is the component name descriptive and follows PascalCase?
2. Are props properly typed with TypeScript?
3. Does it handle all possible states (loading, error, empty, success)?
4. Is it accessible (proper ARIA labels, keyboard navigation)?
5. Does it follow the single responsibility principle?
6. Are side effects properly contained in useEffect or event handlers?
7. Is it testable without extensive mocking?
8. Does it use existing UI components from the library?

---

## Writing Tests Best Practices

When evaluating whether a test you've implemented is good or not, use this checklist:

1. SHOULD parameterize inputs; never embed unexplained literals such as 42 or "foo" directly in the test.
2. SHOULD NOT add a test unless it can fail for a real defect. Trivial asserts (e.g., expect(2).toBe(2)) are forbidden.
3. SHOULD ensure the test description states exactly what the final expect verifies. If the wording and assert don't align, rename or rewrite.
4. SHOULD compare results to independent, pre-computed expectations or to properties of the domain, never to the function's output re-used as the oracle.
5. SHOULD follow the same lint, type-safety, and style rules as prod code (prettier, ESLint, strict types).
6. SHOULD express invariants or axioms (e.g., commutativity, idempotence, round-trip) rather than single hard-coded cases whenever practical. Use property-based testing when appropriate.
7. Unit tests for a function should be grouped under `describe(functionName, () => ...`.
8. Use `expect.any(...)` when testing for parameters that can be anything (e.g. variable ids).
9. ALWAYS use strong assertions over weaker ones e.g. `expect(x).toEqual(1)` instead of `expect(x).toBeGreaterThanOrEqual(1)`.
10. SHOULD test edge cases, realistic input, unexpected input, and value boundaries.
11. SHOULD NOT test conditions that are caught by the type checker.

For React component tests specifically:
- Test user behavior, not implementation
- Use `userEvent` over `fireEvent` for user interactions
- Query by accessible roles and text content
- Test the component's public API (props, user interactions, rendered output)

---

## Project-Specific Guidelines

### Mock to Real Data Transition
When transitioning from mock to real data:
1. Create the API endpoint first
2. Add TypeScript types to shared packages
3. Implement React Query hooks
4. Add loading skeletons
5. Handle error states
6. Remove mock data only after real data is working

### Cross-App Communication
1. Hub and Studio communicate through the shared Fastify API
2. Use environment variables for cross-app URLs
3. Implement proper authentication token sharing
4. Never directly import code between Hub and Studio

### Video Upload Flow
1. User clicks Upload in Hub → Redirects to Studio
2. Studio handles file upload to Mux
3. Moderation runs in background via queue workers
4. AI detection enforces 30% threshold
5. User sees status updates in Studio dashboard

---

## Code Organization

The Fabl monorepo is organized as follows:

### Directory Structure
```
/fabl
├── /apps
│   ├── /hub              # Main viewing app (Next.js)
│   │   ├── /src
│   │   │   ├── /app      # Next.js app router pages
│   │   │   ├── /components # React components
│   │   │   ├── /hooks    # Custom React hooks  
│   │   │   ├── /lib      # Client utilities
│   │   │   └── /api      # BFF API routes
│   │   └── package.json
│   ├── /studio           # Creator dashboard (Next.js)
│   │   └── (same structure as hub)
│   └── /api              # Shared backend (Fastify)
│       ├── /src
│       │   ├── /routes   # API endpoints
│       │   ├── /services # Business logic
│       │   ├── /workers  # Queue workers
│       │   └── /lib      # Backend utilities
│       └── package.json
├── /packages
│   ├── /db               # Prisma schema & client
│   ├── /types            # Shared TypeScript types
│   └── /utils            # Shared utilities
└── /docs                 # Documentation
```

### Where to Put Code
- **UI Components**: In the respective app's `/components` directory
- **API Logic**: In `/apps/api/src/routes` or `/services`
- **Shared Types**: In `/packages/types`
- **Database Schema**: In `/packages/db`
- **React Hooks**: In the app's `/hooks` directory
- **Utilities**: App-specific in `/lib`, shared in `/packages/utils`

## Remember Shortcuts

### QNEW
Understand and follow all BEST PRACTICES listed in this CLAUDE.md.

### QPLAN
Analyze the Fabl codebase structure and ensure your plan:
- Maintains separation between Hub and Studio
- Uses existing UI components
- Follows Next.js 15 App Router patterns
- Reuses shared packages appropriately

### QCODE
Implement your plan ensuring:
- Tests pass in the relevant app
- Prettier formats all files
- TypeScript has no errors
- Linting passes

### QCHECK
Review every major change against:
1. Component/function best practices
2. Testing best practices
3. Fabl-specific implementation patterns

### QUX
List user scenarios for the feature considering:
- Unauthenticated users
- Authenticated viewers (Hub)
- Content creators (Studio)
- Cross-app navigation flows

### QCHECKF
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR function you added or edited (skip minor changes):
1. CLAUDE.md checklist Writing Functions Best Practices.

### QCHECKT
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR test you added or edited (skip minor changes):
1. CLAUDE.md checklist Writing Tests Best Practices.

### QGIT
Add all changes to staging, create a commit, and push to remote.

Follow this checklist for writing your commit message:
- SHOULD use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- SHOULD NOT refer to Claude or Anthropic in the commit message.
- SHOULD structure commit message as follows:
```
<type>[optional scope]: <description>
[optional body]
[optional footer(s)]
```
- Commit SHOULD contain the following structural elements to communicate intent: 
  - `fix`: patches a bug (correlates with PATCH in Semantic Versioning)
  - `feat`: introduces a new feature (correlates with MINOR in Semantic Versioning)
  - `BREAKING CHANGE`: introduces a breaking API change (correlates with MAJOR in Semantic Versioning)
  - Other types: `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`
- For Fabl, include app prefix: `feat(hub):`, `fix(studio):`, `chore(api):`