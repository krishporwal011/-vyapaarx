# VyapaarX Real Database Persistence, Schema Synchronization & Radix Select Fix Walkthrough

This document outlines the complete migration of VyapaarX into a **fully integrated enterprise-grade PostgreSQL & Prisma database persistence ERP system**, including a global schema synchronization audit and Radix UI constraints compliance.

The monorepo has been verified under strict type checks (`npx tsc --noEmit` returns `0` errors/warnings) and is fully operational!

---

## 🛠️ 1. Complete Architecture Summary

### 📂 Folder Structure Refined
```bash
apps/
├── api/                     # Express.js Backend Server
│   ├── prisma/              # Prisma DB schemas & seeding scripts
│   └── src/
│       ├── controllers/     # Auth, suppliers, and sales ledger routes controllers
│       ├── index.js         # API initializer (listening on port 5001)
│       └── routes/          # API route registries
└── web/                     # Next.js 15 App Router Frontend
    ├── app/
    │   ├── (dashboard)/
    │   │   ├── inventory/   # Catalog with real-time React Query mutations
    │   │   ├── profile/     # Active session & credential workspace
    │   │   ├── sales/
    │   │   │   ├── new/     # New Sales Order Creation Page with real products/parties
    │   │   │   └── page.tsx # Tax Invoice generator split-panel ledger
    │   │   └── suppliers/   # Khatabook-inspired split-panel supplier ledger
    │   └── task.md          # Verification task logs
    ├── components/
    │   └── global/
    │       └── LanguageSwitcher.tsx  # Centralized language segment controller
    ├── context/
    │   └── LanguageContext.tsx       # Global i18n react context provider
    └── hooks/
        └── api/
            ├── useProducts.ts        # GET, POST, PUT, DELETE Product mutations
            └── useOrders.ts          # GET, POST Sales Order mutations
```

---

## 🚀 2. Database Persistence Features

### 📦 1. Product Database Persistence ([useProducts.ts](file:///Users/tanyaporwal/Desktop/Vyapaar%20X/apps/web/hooks/api/useProducts.ts))
* Completely eliminated temporary frontend state arrays from the product catalog.
* Integrated:
  * **Fetch Products**: Real-time loading from PostgreSQL.
  * **Add Product**: Mutates and saves product specs directly into the database.
  * **Edit Product**: PUT request updates product schema attributes safely in PostgreSQL.
  * **Delete Product**: Performs standard DELETE requests, instantly invalidating queries to refresh the catalog.

### 🛒 2. Real Sales Order Creation ([sales/new/page.tsx](file:///Users/tanyaporwal/Desktop/Vyapaar%20X/apps/web/app/(dashboard)/sales/new/page.tsx))
* Populates the Customer & Product selects with real, active PostgreSQL entities.
* Created `useCreateOrder()` mutation, which:
  * Automatically decreases item stock counts within Prisma transactions.
  * Preserves invoice records, tax splits, and payment status codes in PostgreSQL.
  * Invalidates analytic caches to refresh KPI cards.

### 🏢 3. Workspace Selection Persistence ([Topbar.tsx](file:///Users/tanyaporwal/Desktop/Vyapaar%20X/apps/web/components/layout/Topbar.tsx))
* Active workspace changes are saved dynamically to `localStorage`.
* Hydrates the workspace session on page refresh to ensure continuous tenant isolation.

---

## 🔍 3. Schema Synchronization & Radix Select Fixes

### 🧾 1. Field Mismatch Fixed
* **The Error**: The API's Zod validator originally checked for `taxRate` on creation/updates, but the Prisma `Product` schema represents taxes as `gstRate`. Because `taxRate` was passed to Prisma, database writes failed with: `Unknown argument taxRate`.
* **The Resolution**:
  * Aligned the Zod schema in **[product.validation.js](file:///Users/tanyaporwal/Desktop/Vyapaar%20X/apps/api/src/validations/product.validation.js)** to validate and map `gstRate` instead of `taxRate`.
  * Verified that both the frontend mutations and backend models use unified `gstRate` attributes across the platform.

### 🔘 2. Radix Select Item Value Fixed
* **The Error**: Radix UI Select components throw an immediate runtime crash if any `<SelectItem />` contains an empty string (`value=""`) as a value attribute.
* **The Resolution**:
  * Audited **[sales/new/page.tsx](file:///Users/tanyaporwal/Desktop/Vyapaar%20X/apps/web/app/(dashboard)/sales/new/page.tsx)** and resolved all instances where `<SelectItem value="" ...>` was configured for empty fallback options, safely replacing them with `value="none"`.

---

## 🛡️ 4. Stability & Compliance
* **React Query Cache Invalidation**: `invalidateQueries` forces immediate refetches of products, orders, and analytics upon successful mutations, preventing stale arrays or inconsistent visual states.
* **Type Safety Verified**: Passing `npx tsc --noEmit` cleanly with **0 errors and 0 warnings**.
