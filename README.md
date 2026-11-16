# mobile-responsive-autoscale

An agent skill and pattern guide for React and Tailwind web applications.

When prompting coding agents to build enterprise interfaces, the desktop views usually look fine on the first try. Problems appear as soon as the same layout opens on a mobile phone: tables cause horizontal scrollbars, modals touch the top edge of the browser, dark mode washes out metadata labels, and buttons shrink below touchable sizes.

This skill equips your coding agent (Cursor, Claude Code, Antigravity, Windsurf, or Cline) with explicit responsive patterns so it writes mobile-first code by default.

## What this skill solves

1. Multi-column tables on mobile. Instead of letting tables overflow or adding horizontal swipe bars, the skill instructs the agent to render a stacked card view below 768px (`md:hidden`) and keep the structured table on desktop (`hidden md:block`).
2. Modal placement and margins. Prevents full-height dialogs from sticking to the top of mobile viewports. It applies `items-start justify-center`, sets a top margin (`mt-6 sm:mt-10`), and caps modal height at `max-h-[88vh]` with a scrollable body.
3. Hierarchical trees. Structures like account charts and category trees often break on phones. The skill provides an indented recursive card pattern that keeps actions and balance figures aligned.
4. Dark mode contrast. Fixes low-contrast text caused by low opacity modifiers on dark backgrounds. It ensures subtitles use `slate-300` or `slate-200`, cards use `slate-900` with `slate-800` borders, and progress bars stay legible.
5. Touch ergonomics and OTP inputs. Enforces `inputMode="numeric"`, auto-advances focus between digits, handles pasted codes, and maintains at least 44px tap targets.
6. Unified color tokens. Avoids inconsistent accent colors across screens by sticking to a clean enterprise blue palette (`blue-600`, `blue-700`, `sky-500`, `teal-500`).

## Installation

### For Antigravity CLI or local agent setups

Place the folder into your project's skill directory:

```bash
mkdir -p .agents/skills/mobile-responsive-autoscale
cp SKILL.md .agents/skills/mobile-responsive-autoscale/SKILL.md
```

### For Cursor

Copy `SKILL.md` into your `.cursor/rules/` directory:

```bash
mkdir -p .cursor/rules
cp SKILL.md .cursor/rules/mobile-responsive-autoscale.mdc
```

### For Claude Code or custom system prompts

You can reference `SKILL.md` directly in your prompt or paste its contents into your project instructions file (`CLAUDE.md` or `AGENTS.md`):

```markdown
Follow the mobile responsive and autoscale guidelines in SKILL.md for all table, modal, and card components.
```

## How to prompt your agent with this skill

Once installed, you can ask your agent to build or convert components:

- "Convert this user list table into a dual-view responsive component using mobile-responsive-autoscale."
- "Refactor this modal so it doesn't stick to the top on mobile screens."
- "Audit this page for horizontal scrollbars on mobile viewports."
- "Fix the contrast of these dashboard summary cards in dark mode."

## Reference files

- `SKILL.md`: The complete instruction file loaded by coding agents.
- `examples/ResponsiveDataTable.tsx`: Reference dual-view data table and card layout.
- `examples/ExecutiveModal.tsx`: Reference modal dialog with top margin and sticky header.
- `examples/MobileTreeNode.tsx`: Reference indented mobile tree node.
