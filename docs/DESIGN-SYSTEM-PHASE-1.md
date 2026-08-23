# VITADIET Phase 1 Design System

This file documents the approved base UI direction for the consumer-first homepage work.

## Colors

- Primary: `--color-brand-primary` for main actions, icons, and active navigation.
- Accent: `--color-brand-accent` for focus outlines and emphasized labels.
- Surfaces: `--color-surface`, `--color-surface-raised`, and `--color-surface-muted`.
- Text: `--color-ink`, `--color-ink-soft`, and `--color-ink-subtle`.
- Borders: `--color-line` and `--color-line-strong`.

## Typography

- Page headlines use the existing heading tokens and tight line-height.
- Card headings use compact title/copy sizes so product names do not overflow.
- Body copy uses `leading-copy` and consumer-facing, direct language.

## Spacing And Layout

- Main sections use `py-section` and `py-section-lg`.
- Content is constrained with `content-container`.
- Product lists use desktop grids and mobile horizontal scroll where needed.

## Buttons And States

- Primary buttons are used for product discovery and buying actions.
- Secondary buttons are used for learn-more actions and supporting navigation.
- Focus uses visible `focus-visible` outlines.
- Disabled buying buttons remain visible for coming-soon products and are not interactive.

## Product Cards

- Product cards are not full-card links.
- Each card contains image, name, short description, pack size or benefit, availability, learn-more, and where-to-buy actions.
- No B2B label, need category, or consumer/distributor message mixing appears in product cards.

## Search Field And Breadcrumb

- Search fields should use the same control radius, border, focus outline, and text tokens.
- Breadcrumbs should be compact, text-first, and use visible focus states for every link.

## Header And Footer

- Header navigation prioritizes consumers: products, quality, where to buy, and about.
- The pharmacy/distributor route remains secondary in the footer.
- Mobile touch targets must stay at least 44px with visible focus.
