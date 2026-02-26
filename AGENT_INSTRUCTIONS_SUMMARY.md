# Agent Instructions Summary

This document provides a quick overview of the agent instruction files configured for Copilot, Claude, and Gemini.

## Files Created
1. **`.github/copilot-instructions.md`** - GitHub Copilot configuration
2. **`CLAUDE.md`** - Claude (all versions: Code, Projects, Chat)
3. **`.gemini/instructions.md`** - Google Gemini configuration

## Your Workflow Preferences (Applied to All Agents)

### 🔧 Development Workflow
- **Commits:** Larger commits per feature (~1 hour of work)
- **Branching:** Direct to `main` for most changes
- **Side projects:** Feature branches (Claude Code creates these automatically)
- **Commit style:** Explain WHY, not just WHAT

### ⚠️ Error Handling
**Strict (Throw Errors):**
- Product data loading
- Cart operations
- Checkout/payment
- Authentication

**Graceful (Degrade):**
- Product recommendations
- Analytics
- Newsletter
- Related products

**Always notify of ALL errors** - even when handling gracefully (console.warn at minimum)

### 📊 Performance vs. Maintainability
- **Default:** Simple, maintainable, reliable code
- **Optimize only when:**
  - Unique competitive features
  - Identified bottlenecks
  - Clear competitive advantage

### 📝 Documentation Style
**EXTENSIVE inline documentation:**
- Explain WHY decisions were made
- Document component relationships
- Help future understanding
- Preferred learning style

### 🧩 Component Architecture
- **Prefer:** Small, single-purpose components
- **But:** Use what makes sense for the feature
- **Document:** Relationships between components

### 📦 Dependencies
- **Use:** Well-maintained libraries to move faster
- **ASK before adding:**
  - New state management
  - New UI frameworks
  - Major architectural changes
  - Large packages

### 🚀 Feature Development
- **Feature flags:** Deploy WIP features hidden behind env vars
- **Branches:** For experimental work
- **Testing:** Build alongside features

### ♿ Accessibility (CRITICAL)
- **Level:** WCAG AA compliance is ESSENTIAL
- **Reason:** Legal liability - can be sued on day 1
- **Required:**
  - Semantic HTML
  - ARIA labels
  - Keyboard navigation
  - Alt text on all images
  - Color contrast (palette is AA compliant)

### 🔄 Commerce Adapter
- **Timeline:** Migration in 6-12 months
- **Priority:** Shopify MUST work flawlessly first
- **Approach:** Keep adapter clean, but don't sacrifice Shopify stability

## Critical Shopify Rule (ALL AGENTS)

### ⛔ NEVER Use ISR on Shopify Pages
```typescript
// ❌ WRONG - Breaks Shopify connection
export const revalidate = 60

// ✅ CORRECT - Works on Hostinger
export const dynamic = "force-dynamic"
```

**Why:** Hostinger injects env vars at runtime. ISR pre-renders at build time when credentials aren't available.

**Affected pages:**
- `src/app/page.tsx`
- `src/app/shop/page.tsx`
- `src/app/collections/[handle]/page.tsx`
- `src/app/product/[handle]/page.tsx`

## Quick Reference

### When to Ask for Approval
- Adding large dependencies that change architecture
- Converting Shopify pages to ISR (answer is always NO)
- Major refactoring that affects multiple systems
- Deploying features that could impact accessibility
- Changes to the commerce adapter interface

### When to Proceed Autonomously
- Adding small utility libraries
- Writing new features with feature flags
- Fixing bugs
- Adding tests
- Improving documentation
- SEO optimizations
- Styling tweaks

### Agent-Specific Notes

**GitHub Copilot:**
- Autocomplete with context from `.github/copilot-instructions.md`
- Follows patterns automatically
- Use for quick coding tasks

**Claude:**
- Read `CLAUDE.md` for full context
- Best for complex features and architecture decisions
- Can create feature branches autonomously

**Gemini:**
- Read `.gemini/instructions.md` for full context
- Good for code review and optimization suggestions
- Follows same patterns as other agents

## Key Anti-Patterns (ALL AGENTS MUST AVOID)

❌ Using ISR on Shopify pages
❌ Silent error handling (always log!)
❌ Skipping accessibility features
❌ Adding large dependencies without asking
❌ Bypassing commerce adapter layer
❌ Exposing server-only env vars
❌ Over-engineering for hypothetical futures
❌ Optimizing before profiling
❌ Sacrificing Shopify stability

## Documentation Files

**Critical Reference:**
- `HOSTINGER_DEPLOYMENT_FIX.MD` - Shopify connection fix
- `PRD.md` - Product requirements
- `SEO_IMPLEMENTATION_LOG.md` - SEO strategy

**Development:**
- `SETUP.md` - Development setup
- `HOSTINGER_DEPLOY.md` - Deployment guide
- `SHOPIFY_DEV_STRATEGY.md` - Shopify guidelines

## Using These Instructions

### GitHub Copilot
Automatically reads `.github/copilot-instructions.md` in your repository.

### Claude
- **Claude Code:** Automatically reads `CLAUDE.md` from project root
- **Claude Projects:** Add `CLAUDE.md` to project knowledge
- **Claude Chat:** Reference `CLAUDE.md` when starting conversations

### Gemini
Add `.gemini/instructions.md` to your workspace or reference it manually.

## Keeping Instructions Updated

When you discover new patterns or fix issues:
1. Update the relevant agent instruction file(s)
2. Document in `C:\Users\civen\.claude\projects\C--Dev-Land-mamafern\memory\MEMORY.md`
3. Create fix logs like `HOSTINGER_DEPLOYMENT_FIX.MD` for critical issues

This ensures all agents learn from mistakes and maintain consistency.
