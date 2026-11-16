---
name: mobile-responsive-autoscale
description: Comprehensive methodology and actionable patterns for implementing zero-horizontal-scroll mobile responsive layouts, auto-scaled card views from data tables, hierarchical tree cards, executive modals with top margins, touch ergonomics, high-contrast dark mode, and strict Enterprise Blue spectrum branding across React, Tailwind CSS, Vite, and modern enterprise web applications.
---

# Mobile Responsive & Autoscale Content Skill

This skill provides the battle-tested blueprint and production-grade design patterns to transform desktop-heavy enterprise web applications (tables, trees, toolbars, modals, kanban boards, and charts) into clean, zero-horizontal-scroll, high-contrast mobile experiences.

---

## 1. When to Use This Skill

Activate this skill when:
- Converting multi-column data tables (`<table>`) into zero-horizontal-scroll mobile card stacks (`md:hidden`).
- Making hierarchical/tree structures (e.g., Chart of Accounts, folder trees) mobile-friendly without horizontal clipping.
- Tuning modal dialogs for mobile viewports: fixing cramped headers, ensuring comfortable margin-top spacing from browser bars, and making complex permission/matrix tables scrollable.
- Eliminating horizontal overflow/scrolling on mobile viewports (`< 768px`).
- Preventing iOS Safari auto-zoom on form input focus without compromising desktop styling.
- Optimizing mobile touch targets, safe-area insets (`env(safe-area-inset-*)`), and sticky bottom actions.
- Resolving low-contrast text and washed-out badges in dark mode across dashboard widgets and kanban columns.
- Making page action bars and segmented toolbars stay inline on desktop without wrapping awkwardly or breaking on mobile.
- Enforcing the **Strict Enterprise Blue Spectrum** branding (zero purple/indigo classes).

---

## 2. Core Principles (Zero Horizontal Scroll & Brand Standards)

1. **Dual-View Pattern Over Table Scrolling:**
   Never force users to horizontally swipe across wide multi-column tables on mobile. Instead, render a clean **stacked card view** for `< 768px` (`md:hidden`) and preserve the structured table for `>= 768px` (`hidden md:block`).
2. **Container Fluidity:**
   Outer wrappers must use `w-full max-w-full overflow-hidden` or `overflow-x-hidden`. Never set fixed pixel widths (`w-[1200px]`) on container elements without responsive constraints (`max-w-full`).
3. **Modal Margin-Top & Vertical Breathing Space:**
   Never center large modals with `items-center` without generous margins; on mobile and small laptop screens, large modals cling awkwardly to the browser top bar. Always use `items-start justify-center` with explicit top spacing (`pt-6 sm:pt-10 md:pt-14` or `mt-6 sm:mt-10 mb-6 sm:mb-10`) and a maximum height constraint (`max-h-[88vh] sm:max-h-[86vh] flex flex-col`).
4. **Strict Enterprise Blue Brand Spectrum (Zero Purple/Indigo Policy):**
   In this enterprise application, all primary actions, active indicators, badges, highlights, focus rings, and modal icon backgrounds must strictly adhere to the **Enterprise Blue Spectrum** (`blue-600`, `blue-700`, `sky-500`, `teal-500`). Never introduce `indigo-*` or `purple-*` classes in UI components.
5. **Touch Ergonomics:**
   Interactive buttons on mobile must have a minimum hit target of `38px` to `44px`, with tap feedback (`active:scale-95 transition-all`).
6. **Content-Aware Truncation:**
   Truncate long secondary strings (`truncate max-w-[140px]`), but keep currency, dates, and status badges fully visible.

---

## 3. Shell & Viewport Blueprint

### HTML Head Configuration
Ensure the viewport meta tag handles dynamic viewport heights and notch safe-areas:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
```

### CSS Safe Area & iOS Zoom Fixes
In your global CSS (`src/styles/index.css` or equivalent):
```css
:root {
  --sat: env(safe-area-inset-top, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
  --sal: env(safe-area-inset-left, 0px);
  --sar: env(safe-area-inset-right, 0px);
}

/* Prevent iOS Safari 16px auto-zoom on form inputs without breaking desktop styling */
@media screen and (max-width: 640px) {
  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  input[type="search"],
  select,
  textarea {
    font-size: 16px !important;
  }
}

/* Smooth momentum scrolling on mobile containers */
.mobile-scroll-container {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}
```

---

## 4. The Dual-View Table-to-Card Pattern

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│ Page Container (w-full max-w-full overflow-hidden)          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Desktop Table (hidden md:block overflow-x-auto)         │ │
│ │  - Column headers, sorting, compact density             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Mobile Card Stack (md:hidden divide-y divide-slate-100) │ │
│ │  - Card Item:                                           │ │
│ │    1. Header: Primary ID + Status Badge                 │ │
│ │    2. Body: 2 or 3-column Metadata Grid                 │ │
│ │    3. Footer: Full-width or Touch Action Buttons        │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Reference Implementation (React / TSX + Tailwind)

```tsx
export function ResponsiveDataTable({ data, onEdit, onDelete, onView }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      
      {/* 1. DESKTOP VIEW (Visible on >= md / 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Kode / ID</th>
              <th className="py-3 px-4">Nama</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4 text-right">Nominal</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
            {data.map((item, rowIndex) => (
              <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{item.code}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-100">{item.name}</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{item.category}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                  {formatCurrency(item.amount)}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button onClick={() => onView(item)} className="p-1.5 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(item)} className="p-1.5 hover:text-amber-600 rounded-lg">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. MOBILE CARD VIEW (Visible on < md / 768px) */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {data.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">Belum ada data</div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              {/* Header: Primary ID + Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="min-w-0 flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 truncate">
                    {item.code}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {item.name}
                  </span>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {/* Body: Metadata 2-Column Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-2.5 text-[11px]">
                <div>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                    Kategori
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                    {item.category || '-'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                    Nominal
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 block">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>

              {/* Footer: Action Buttons */}
              <div className="flex items-center justify-end gap-1.5 pt-0.5">
                <button
                  onClick={() => onView(item)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Detail
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
```

---

## 5. Hierarchical / Tree Data Mobile Card Pattern

Hierarchical structures like Chart of Accounts (COA) or nested category trees break traditional nested `<table>` tags on phones. Use the **Recursive Indented Card** pattern:

```tsx
function MobileTreeNode({ node, level = 0, isExpanded, onToggle, onAddSub, onEdit, onDelete }) {
  const hasChildren = node.children && node.children.length > 0;
  const isHeader = node.is_header || level < 2;

  return (
    <div className="border-b border-slate-100 dark:border-slate-800/80">
      {/* Node Row */}
      <div 
        className={`p-3 transition-colors ${
          isHeader 
            ? 'bg-slate-50/70 dark:bg-slate-800/50 font-bold' 
            : 'bg-white dark:bg-slate-900 font-medium'
        }`}
        style={{ paddingLeft: `${Math.max(12, level * 14 + 12)}px` }}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Left: Expand Chevron + Code + Name */}
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren ? (
              <button
                onClick={() => onToggle(node.id)}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
                aria-label={isExpanded ? 'Tutup' : 'Buka'}
              >
                <ChevronIcon className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            ) : (
              <span className="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-700 text-xs">•</span>
            )}

            <div className="min-w-0">
              <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 mr-1.5">
                {node.code}
              </span>
              <span className="text-xs text-slate-900 dark:text-slate-100 truncate">
                {node.name}
              </span>
            </div>
          </div>

          {/* Right: Balance Pill */}
          <div className="shrink-0 text-right">
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-emerald-400">
              {formatCurrency(node.balance)}
            </span>
          </div>
        </div>

        {/* Action Row for Sub-Accounts */}
        <div className="flex items-center justify-end gap-1 mt-2 pt-1.5 border-t border-slate-100/60 dark:border-slate-800/40">
          <button onClick={() => onAddSub(node)} className="text-[10px] font-bold px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50">
            + Sub
          </button>
          <button onClick={() => onEdit(node)} className="text-[10px] font-bold px-2 py-0.5 rounded text-slate-500 hover:text-slate-800 dark:text-slate-400">
            Edit
          </button>
        </div>
      </div>

      {/* Recursive Children Container */}
      {hasChildren && isExpanded && (
        <div className="transition-all">
          {node.children.map((child) => (
            <MobileTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
              onAddSub={onAddSub}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 6. Header Action Toolbar Inline Stabilization

Avoid wrapping title banners onto multiple lines on desktop while keeping them cleanly stacked on mobile:

```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
  
  {/* Title & Badge (shrink-proof, truncates safely if ultra narrow) */}
  <div className="min-w-0 flex items-center gap-2.5">
    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
      <FileTextIcon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
          Bagan Akun (Chart of Accounts)
        </h1>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
          Aktif
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
        Kelola struktur hierarki rekening pembukuan
      </p>
    </div>
  </div>

  {/* Actions Bar (Keeps inline on PC via whitespace-nowrap shrink-0) */}
  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap sm:flex-nowrap">
    {/* Segmented Control / Compact Group */}
    <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5">
      <button 
        onClick={expandAll}
        className="px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg whitespace-nowrap transition-colors"
      >
        Buka
      </button>
      <span className="w-px bg-slate-200 dark:bg-slate-700 my-1"></span>
      <button 
        onClick={collapseAll}
        className="px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg whitespace-nowrap transition-colors"
      >
        Tutup
      </button>
    </div>

    {/* Primary Action Button */}
    <button
      onClick={handleCreate}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm whitespace-nowrap active:scale-95 transition-all"
    >
      <PlusIcon className="w-4 h-4" />
      <span>Tambah Akun</span>
    </button>
  </div>

</div>
```

---

## 7. Modal Dialog Ergonomics (Margin-Top & Spacious Header Pattern)

A critical lesson learned from executive enterprise UI audits: modals that take up `max-h-[94vh]` and use `items-center` without vertical margins stick directly to the top edge of the browser window.

### Executive Modal Standard
1. **Backdrop & Positioning:** Always use `fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto`.
2. **Top Spacing & Height:** Assign `mt-6 sm:mt-10 mb-6 sm:mb-10` with `max-h-[88vh] sm:max-h-[86vh] flex flex-col`.
3. **Spacious Header:** Padding of `px-6 sm:px-8 py-5 sm:py-6`, with a prominent `w-12 h-12 rounded-2xl` gradient icon (`bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white`).
4. **Sticky Header & Footer:** The header and footer stay pinned while the body scrolls smoothly (`overflow-y-auto p-6 sm:p-8`).

```tsx
export function ExecutiveModal({ isOpen, onClose, title, subtitle, children, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[88vh] sm:max-h-[86vh] mt-6 sm:mt-10 mb-6 sm:mb-10 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        
        {/* Spacious Header */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white flex items-center justify-center text-lg shadow-md ring-4 ring-blue-500/10 shrink-0">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors shrink-0"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 min-h-0">
          {children}
        </div>

        {/* Sticky Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm active:scale-95 transition-all"
          >
            Simpan Perubahan
          </button>
        </div>

      </div>
    </div>
  );
}
```

---

## 8. Dashboard Widgets & Kanban Dark Mode Optimization

In dark mode, low-opacity Tailwind classes (`bg-slate-500/10`, `text-slate-400/80`) cause severe eye fatigue and illegibility.

### Rules for High-Contrast Dark Mode:
1. **Container & Cards:**
   - Dark background: `bg-slate-900 border border-slate-800`
   - Nested cards/items: `bg-slate-800/80 dark:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600`
2. **Typography Hierarchy:**
   - Headings: `text-white dark:text-slate-100 font-extrabold`
   - Primary data/numbers: `font-mono font-bold text-white dark:text-slate-100`
   - Subtitles & metadata labels: `text-slate-600 dark:text-slate-300 font-semibold`
3. **Progress Bars & Gauges:**
   - Background track: `bg-slate-200 dark:bg-slate-700`
   - Fill colors: Always use saturated, unmuted tokens (`bg-blue-500`, `bg-emerald-500`, `bg-amber-500`).
4. **Mobile Kanban Columns (Snap Scroll):**
   ```tsx
   <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-4 md:overflow-x-visible">
     {columns.map((col) => (
       <div key={col.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center flex-1 bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
         {/* Column Content */}
       </div>
     ))}
   </div>
   ```

---

## 9. Responsive Data Visualizations & Charts

Enterprise dashboard charts (Chart.js / SVG) must autoscale smoothly without horizontal overflow.

### Best Practice Pattern:
```tsx
<div className="w-full bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Tren Penjualan Bulanan</h3>
  </div>

  {/* Chart Container with relative positioning and explicit heights */}
  <div className="relative w-full h-64 sm:h-72 md:h-80 min-w-0">
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              font: { size: 10 },
            },
            grid: { display: false },
          },
          y: {
            ticks: { font: { size: 10 } },
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
          },
        },
      }}
    />
  </div>
</div>
```

---

## 10. Mobile Touch & OTP Form Ergonomics

Forms, particularly authentication and numeric code inputs, require specialized ergonomics:
- **`inputMode="numeric"` and `pattern="[0-9]*"`**: Triggers numeric keypad on Android and iOS without symbols.
- **Auto-Advance & Backspace**: When typing a digit into a verification block, auto-advance to `index + 1`. When pressing Backspace on an empty field, retreat focus to `index - 1`.
- **Paste Event Handling**: Sanitize pasted strings (`replace(/\D/g, '')`) and slice to exact digit length.
- **Touch Target Sizing**: Primary submit buttons must have `h-11 sm:h-12` (minimum 44px) and `active:scale-95 transition-all`.

---

## 11. Verification & QA Checklist

Before marking any mobile responsive task complete:
- [ ] **Viewport Width Check:** Test at mobile viewports: `360px`, `390px` (iPhone 14), `412px` (Android), `768px` (Tablet), and `1280px+` (Desktop).
- [ ] **Zero Horizontal Scroll Test:** Run in browser console:
  ```js
  document.body.scrollWidth > window.innerWidth
  ```
  Expected: **`false`**.
- [ ] **Modal Margin-Top Audit:** Confirm modals have at least `24px` (`mt-6`) top clearance and do not cling to the top bar.
- [ ] **Strict Enterprise Blue Verification:** Run grep check across modified files for banned colors:
  ```powershell
  Select-String -Path "src\**\*.tsx" -Pattern "(indigo|purple)-"
  ```
  Expected: **0 matches**.
- [ ] **Dark Mode Contrast Audit:** Check badges, subtitles, and progress bars under dark mode to ensure minimum 4.5:1 WCAG AA contrast.
- [ ] **Input Focus Zoom Test:** On iOS Safari simulation, verify tapping text/number inputs does not trigger unwanted viewport auto-zoom.
