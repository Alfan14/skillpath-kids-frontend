The project currently contains:
- duplicated architectures
- invalid Server/Client boundaries
- React component serialization issues
- duplicated folders
- duplicated components
- inconsistent naming
- Tailwind v4 migration leftovers
- invalid data modeling
- broken imports
- invalid App Router patterns

Your job:
Perform a COMPLETE architecture normalization and modernization for Next.js 15 App Router with TypeScript + Tailwind v4.

---

# PRIMARY OBJECTIVES

1. Eliminate all runtime serialization errors
2. Normalize folder structure
3. Remove duplicated architecture
4. Enforce strict Server/Client separation
5. Standardize component conventions
6. Standardize type system
7. Ensure successful `next build`
8. Preserve current UI behavior
9. Modernize for scalable production structure

---

# REQUIRED ARCHITECTURE

Use this structure:

src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
├── features/
│   ├── achievements/
│   ├── assessment/
│   ├── files/
│   ├── results/
│   └── tips/
├── lib/
├── hooks/
├── data/
├── types/
└── styles/

---

# CRITICAL REFACTOR RULES

## 1. REMOVE DUPLICATE FOLDERS

DELETE:
- src/feature

KEEP:
- src/features

Update ALL imports accordingly.

---

## 2. REMOVE DUPLICATE COMPONENTS

Find duplicated files:
- progress/progess typo files
- bottom-nav vs bottom-bar
- repeated badge components
- repeated card components

Keep only ONE canonical version.

Fix all imports.

---

## 3. FIX SERVER/CLIENT BOUNDARY VIOLATIONS

NEVER pass:
- React components
- functions
- class instances
- Lucide icons
- methods

through props from Server Components to Client Components.

INVALID:
```ts
icon: Trophy
````

VALID:

```ts
icon: 'trophy'
```

---

## 4. CREATE ICON MAPPER SYSTEM

Create:

src/lib/icon-map.ts

Requirements:

* map string → Lucide component
* export `getIcon()`
* provide fallback icon
* fully typed

Example:

```ts
const iconMap = {
  trophy: Trophy,
  star: Star,
};
```

Client Components must resolve icons internally.

---

## 5. REWRITE ALL TYPES

Replace ALL:

```ts
icon: LucideIcon
```

with:

```ts
icon: string
```

Applies to:

* Badge
* Recommendation
* Worksheet
* NavItem
* AssessmentQuestion

---

## 6. STANDARDIZE CLIENT COMPONENTS

Components using:

* useState
* useEffect
* framer-motion
* browser APIs
* event handlers

MUST contain:

```ts
'use client';
```

Server Components must NOT import browser-only libraries.

---

## 7. FIX FRAMER MOTION USAGE

Framer Motion components MUST be Client Components.

Convert:

* badge-card
* animated cards
* progress animations

into isolated client-only components.

Prevent server invocation of:

```ts
motion.div
createMotionComponent()
```

---

## 8. FIX BUTTON ARCHITECTURE

Current issues:

* broken `asChild`
* invalid Slot usage
* React.Children.only crashes

Requirements:

* use `@radix-ui/react-slot`
* support Next Link
* support loading states
* support icons
* support ref forwarding
* avoid passing invalid DOM props

---

## 9. FIX TAILWIND V4 SETUP

Requirements:

* remove obsolete Tailwind v3 configs
* ensure proper Tailwind v4 CSS import order
* move Google Fonts import to top
* validate globals.css

Required:

```css
@import url(...);

@import "tailwindcss";
```

before ALL rules.

---

## 10. FIX APP ROUTER STRUCTURE

Requirements:

* ensure root app/layout.tsx exists
* ensure root page.tsx exists
* route groups must not break root routing
* normalize dashboard layouts

App Router rules:

* layouts return html/body only at root
* nested layouts only return wrappers

---

## 11. FIX IMPORT CONSISTENCY

Normalize:

* alias imports
* casing
* filenames
* extension consistency

Prevent Windows/Linux casing conflicts.

---

## 12. FIX TYPESCRIPT STRICT MODE

Requirements:

* eliminate all TS errors
* eliminate all implicit any
* remove invalid union mismatches
* ensure full type compatibility

---

## 13. FIX SERVER ACTION SIGNATURES

Ensure:

* all delete/update/create functions use consistent parameters
* all callers pass correct arguments
* auth tokens handled consistently

---

## 14. REMOVE VITE REMNANTS

Delete:

* old Vite patterns
* React SPA leftovers
* App.tsx architecture remnants
* invalid client-router assumptions

---

## 15. FINAL VALIDATION

After refactor:

* `npm run build` must succeed
* `npm run lint` must succeed
* no hydration errors
* no serialization errors
* no Tailwind warnings
* no duplicate architecture

---

# OUTPUT FORMAT

Perform:

1. file restructuring
2. import rewriting
3. type rewriting
4. component rewriting
5. architecture normalization

Then provide:

* summary of changes
* list of deleted files
* list of renamed files
* list of created files
* remaining warnings if any

DO NOT leave partial migrations.
DO NOT preserve broken legacy architecture.
DO NOT keep duplicate systems.

```
```
