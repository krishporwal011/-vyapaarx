# Task Checklist - Production-Grade ERP Upgrade

- [x] Audit and remove mock defaults to implement beautiful empty states
- [x] Upgrade Product form fields to support category, HSN codes, and unit types
- [x] Create Razorpay & UPI transaction dashboards inside `/payments`
- [x] Build multi-step onboarding workspace checklist at `/onboarding`
- [x] Completely connect Sales workflows and New Sale creators inside `/sales`
- [x] Redesign layout with split-panel Khatabook ledgers & multilingual support inside `/suppliers`
- [x] Implement global centralized LanguageProvider i18n architecture and refactor all panels
- [x] Create fully functional `/profile` page with active session security lists
- [x] Redesign Sidebar footer with Profile quick controls and inline multilingual switches
- [x] Massively expand translation dictionaries and translate entire Sidebar layout with zero hardcoding
- [x] Fix the Axios endpoint port configuration inside `.env` to prevent 404 login errors
- [x] Verify zero TypeScript compile errors via `npx tsc --noEmit`
