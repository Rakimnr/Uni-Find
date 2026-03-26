
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLostItems } from "../../api/lostApi.js";

/**
 * UniFind - HomeBrowsePage
 * Extended showcase version for Lost Portal module.
 * This single file intentionally contains multiple UI sections, utilities,
 * drawers, modals, dashboards, helper components, and local state logic
 * so the module feels like a complete product demo.
 */

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,300;1,9..144,400;1,9..144,600;1,9..144,700;1,9..144,800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --uf-ink: #1f1408;
    --uf-ink-soft: #5f4630;
    --uf-ink-fade: #8b7058;
    --uf-bg: #fbf7f0;
    --uf-bg-warm: #f8efe1;
    --uf-surface: rgba(255, 252, 246, 0.92);
    --uf-surface-2: #fff9f1;
    --uf-line: rgba(210, 141, 34, 0.18);
    --uf-line-soft: rgba(210, 141, 34, 0.08);
    --uf-gold: #d88b12;
    --uf-gold-2: #efaa34;
    --uf-amber: #e56c18;
    --uf-green: #1f8b54;
    --uf-red: #c54e38;
    --uf-shadow-sm: 0 3px 10px rgba(31, 20, 8, 0.06);
    --uf-shadow-md: 0 12px 32px rgba(31, 20, 8, 0.08);
    --uf-shadow-lg: 0 24px 70px rgba(31, 20, 8, 0.12);
    --uf-shadow-xl: 0 42px 100px rgba(31, 20, 8, 0.14);
    --uf-r-xs: 12px;
    --uf-r-sm: 18px;
    --uf-r-md: 24px;
    --uf-r-lg: 34px;
    --uf-r-xl: 46px;
    --uf-display: 'Fraunces', Georgia, serif;
    --uf-body: 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --uf-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --uf-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: var(--uf-body);
    background: var(--uf-bg);
    color: var(--uf-ink);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.22;
    z-index: 9999;
    background-image:
      radial-gradient(circle at 15% 20%, rgba(216,139,18,0.08), transparent 20%),
      radial-gradient(circle at 85% 70%, rgba(229,108,24,0.07), transparent 24%),
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 30%);
    mix-blend-mode: multiply;
  }

  ::selection {
    background: rgba(216,139,18,0.18);
    color: var(--uf-ink);
  }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-thumb { background: rgba(216,139,18,0.65); border-radius: 99px; }
  ::-webkit-scrollbar-track { background: transparent; }

  @keyframes ufSpin { to { transform: rotate(360deg); } }
  @keyframes ufFloatA { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
  @keyframes ufFloatB { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
  @keyframes ufPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.06); opacity: .82; } }
  @keyframes ufFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0px); } }
  @keyframes ufScaleIn { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes ufShimmer { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
  @keyframes ufSlideRight { from { transform: translateX(-50%); } to { transform: translateX(0%); } }
  @keyframes ufMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes ufGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(216,139,18,0.2); } 50% { box-shadow: 0 0 0 10px rgba(216,139,18,0); } }

  .uf-animate { animation: ufFadeUp .65s var(--uf-ease) both; }
  .uf-animate-scale { animation: ufScaleIn .45s var(--uf-ease) both; }
  .uf-delay-100 { animation-delay: .1s; }
  .uf-delay-200 { animation-delay: .2s; }
  .uf-delay-300 { animation-delay: .3s; }
  .uf-delay-400 { animation-delay: .4s; }
  .uf-delay-500 { animation-delay: .5s; }
  .uf-delay-600 { animation-delay: .6s; }

  .uf-btn {
    transition:
      transform .22s var(--uf-spring),
      box-shadow .22s ease,
      background .22s ease,
      border-color .22s ease,
      color .22s ease;
  }

  .uf-btn:hover {
    transform: translateY(-3px) scale(1.01);
  }

  .uf-btn:active {
    transform: translateY(0px) scale(.98);
  }

  .uf-card {
    transition: transform .35s var(--uf-ease), box-shadow .35s ease, border-color .35s ease;
  }

  .uf-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--uf-shadow-lg);
    border-color: rgba(216,139,18,0.22);
  }

  .uf-card:hover .uf-card-image {
    transform: scale(1.05);
  }

  .uf-card-image {
    transition: transform .55s var(--uf-ease);
  }

  .uf-chip {
    transition: transform .18s ease, background .18s ease, color .18s ease, border-color .18s ease;
  }

  .uf-chip:hover {
    transform: translateY(-2px);
  }

  .uf-input-shell {
    transition: border-color .22s ease, box-shadow .22s ease, transform .22s ease;
  }

  .uf-input-shell:focus-within {
    border-color: rgba(216,139,18,0.42);
    box-shadow: 0 0 0 4px rgba(216,139,18,0.08);
    transform: translateY(-1px);
  }

  .uf-tab {
    transition: background .22s ease, color .22s ease, box-shadow .22s ease, transform .22s ease;
  }

  .uf-tab:hover {
    transform: translateY(-1px);
  }

  .uf-soft-panel {
    background: var(--uf-surface);
    border: 1px solid var(--uf-line);
    box-shadow: var(--uf-shadow-sm);
    border-radius: var(--uf-r-lg);
  }

  .uf-marquee {
    animation: ufMarquee 26s linear infinite;
  }

  .uf-marquee:hover {
    animation-play-state: paused;
  }

  .uf-dashboard-tile:hover .uf-dashboard-icon {
    transform: scale(1.08) rotate(2deg);
  }

  .uf-dashboard-icon {
    transition: transform .22s ease;
  }

  .uf-overlay {
    position: fixed;
    inset: 0;
    background: rgba(31,20,8,0.38);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 140;
    padding: 1.2rem;
    animation: ufScaleIn .2s ease;
  }

  .uf-drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(31,20,8,0.28);
    backdrop-filter: blur(6px);
    z-index: 130;
    display: flex;
    justify-content: flex-end;
  }

  .uf-drawer {
    width: min(100%, 560px);
    height: 100%;
    background: linear-gradient(180deg, #fffdf8, #fff7eb);
    border-left: 1px solid var(--uf-line);
    box-shadow: -24px 0 60px rgba(31,20,8,0.15);
    overflow-y: auto;
    animation: ufSlideRight .28s var(--uf-ease);
  }

  .uf-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
  .uf-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
  .uf-grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }

  .uf-kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 28px;
    padding: 0 .5rem;
    border-radius: 10px;
    border: 1px solid var(--uf-line);
    background: white;
    box-shadow: var(--uf-shadow-sm);
    font-size: .72rem;
    font-weight: 700;
    color: var(--uf-ink-soft);
  }

  @media (max-width: 1160px) {
    .uf-hero-grid { grid-template-columns: 1fr !important; }
    .uf-grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 900px) {
    .uf-browse-grid { grid-template-columns: 1fr !important; }
    .uf-cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .uf-filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .uf-stats-row { flex-direction: column; }
  }

  @media (max-width: 680px) {
    .uf-nav-wrap { flex-direction: column; align-items: stretch !important; }
    .uf-filter-grid { grid-template-columns: 1fr !important; }
    .uf-cards-grid { grid-template-columns: 1fr !important; }
    .uf-grid-4,
    .uf-grid-3,
    .uf-grid-2 { grid-template-columns: 1fr; }
    .uf-hero-actions { flex-direction: column; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Icon = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Grid: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Sort: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h13"/><path d="M3 12h9"/><path d="M3 18h5"/><path d="m17 16 4 4 4-4" transform="translate(-1 -2) scale(.85)"/><path d="M20 6v12"/></svg>,
  Pin: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Calendar: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></svg>,
  ArrowLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m11 5-7 7 7 7"/></svg>,
  Sparkle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/></svg>,
  Bell: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17H5.76a2 2 0 0 1-1.84-2.8l.57-1.2A7 7 0 0 0 5 10V8a7 7 0 1 1 14 0v2c0 1.06.24 2.11.7 3.06l.57 1.2A2 2 0 0 1 18.43 17H15"/><path d="M9 17a3 3 0 0 0 6 0"/></svg>,
  Heart: ({ filled = false }) => filled
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-6.7-4.35-9.6-8.3C-.53 8.73 2.1 3 7 3c2.3 0 3.8 1.26 5 2.8C13.2 4.26 14.7 3 17 3c4.9 0 7.53 5.73 4.6 9.7C18.7 16.65 12 21 12 21Z"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-6.7-4.35-9.6-8.3C-.53 8.73 2.1 3 7 3c2.3 0 3.8 1.26 5 2.8C13.2 4.26 14.7 3 17 3c4.9 0 7.53 5.73 4.6 9.7C18.7 16.65 12 21 12 21Z"/></svg>,
  Bookmark: ({ filled = false }) => filled
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"/></svg>,
  Close: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  Chart: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-4 4"/></svg>,
  Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 5-3.5 8.7-7 10-3.5-1.3-7-5-7-10V6l7-3Z"/></svg>,
  User: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="5"/></svg>,
  Layers: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/></svg>,
  Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 22v-6h6"/><path d="M20.49 9A9 9 0 0 0 5 5.64L3 8"/><path d="M3.51 15A9 9 0 0 0 19 18.36L21 16"/></svg>,
  Info: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 10v6"/><path d="M12 7h.01"/></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>,
  Target: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>,
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS / DATA
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  Electronics: "💻",
  Accessories: "🎒",
  Books: "📚",
  Documents: "🪪",
  Clothing: "👕",
  Jewelry: "💍",
  Keys: "🔑",
  Bottles: "🥤",
  Gadgets: "📱",
  Stationery: "✏️",
  Other: "📦",
};

const STATUS_META = {
  open: { label: "Open", tone: "#1f8b54", bg: "#e8f8ef", dot: "#2dcc71" },
  possible_match: { label: "Possible Match", tone: "#a86900", bg: "#fff4de", dot: "#f0ae2e" },
  under_review: { label: "Under Review", tone: "#8c5b14", bg: "#f8ecda", dot: "#da9729" },
  closed: { label: "Returned", tone: "#5d5d5d", bg: "#efefef", dot: "#a2a2a2" },
};

const SAMPLE_ITEMS = [
  {
    _id: "l1",
    title: 'MacBook Pro 14"',
    category: "Electronics",
    lostLocation: "Student Center - 2nd Floor Lounge",
    dateLost: "2026-03-19",
    color: "Silver",
    brand: "Apple",
    description: "Silver MacBook Pro with a small sticker near the trackpad and a faint scratch on the left corner.",
    status: "open",
    reporterName: "Daniel Perera",
    contactMethod: "In-app message",
    tags: ["laptop", "silver", "charger missing"],
    rewardOffered: true,
    rewardAmount: 5000,
    claimCount: 2,
    views: 76,
    image: "",
  },
  {
    _id: "l2",
    title: "Blue JanSport Backpack",
    category: "Accessories",
    lostLocation: "Main Library - Study Room 4B",
    dateLost: "2026-03-21",
    color: "Navy Blue",
    brand: "JanSport",
    description: "Contains lecture notes, a black calculator pouch, and a water bottle side pocket.",
    status: "open",
    reporterName: "Heshani Fernando",
    contactMethod: "Phone & in-app",
    tags: ["bag", "blue", "notes"],
    rewardOffered: false,
    rewardAmount: 0,
    claimCount: 1,
    views: 48,
    image: "",
  },
  {
    _id: "l3",
    title: "Student ID Card",
    category: "Documents",
    lostLocation: "Cafeteria Near Coffee Bar",
    dateLost: "2026-03-23",
    color: "White / Blue",
    brand: "SLIIT",
    description: "University ID card with faded edges and a protective transparent cover.",
    status: "possible_match",
    reporterName: "Akeel Mendis",
    contactMethod: "In-app message",
    tags: ["id", "document", "student pass"],
    rewardOffered: false,
    rewardAmount: 0,
    claimCount: 4,
    views: 89,
    image: "",
  },
  {
    _id: "l4",
    title: "Sony WH-1000XM4 Headphones",
    category: "Electronics",
    lostLocation: "Fitness Center - Locker Area",
    dateLost: "2026-03-11",
    color: "Black",
    brand: "Sony",
    description: "Black noise-cancelling headphones in a grey case with a boarding-tag key ring attached.",
    status: "closed",
    reporterName: "Nethmi Silva",
    contactMethod: "Email",
    tags: ["headphones", "black", "case"],
    rewardOffered: true,
    rewardAmount: 2500,
    claimCount: 3,
    views: 120,
    image: "",
  },
  {
    _id: "l5",
    title: "Honda Civic Car Keys",
    category: "Keys",
    lostLocation: "Parking Lot B Entrance",
    dateLost: "2026-03-22",
    color: "Black",
    brand: "Honda",
    description: "Remote key fob with a small yellow duck keychain and one house key attached.",
    status: "open",
    reporterName: "Kavishka Jay",
    contactMethod: "In-app message",
    tags: ["keys", "vehicle", "duck keychain"],
    rewardOffered: true,
    rewardAmount: 3000,
    claimCount: 2,
    views: 61,
    image: "",
  },
  {
    _id: "l6",
    title: "Hydro Flask Bottle",
    category: "Bottles",
    lostLocation: "Open Air Theater",
    dateLost: "2026-03-17",
    color: "White",
    brand: "Hydro Flask",
    description: "Large bottle with wave and mountain stickers. Slight dent near the base.",
    status: "under_review",
    reporterName: "Raveen Iddamalgoda",
    contactMethod: "In-app message",
    tags: ["bottle", "white", "stickers"],
    rewardOffered: false,
    rewardAmount: 0,
    claimCount: 5,
    views: 34,
    image: "",
  },
  {
    _id: "l7",
    title: "Calculus Textbook 9th Edition",
    category: "Books",
    lostLocation: "Science Hall Room 301",
    dateLost: "2026-03-16",
    color: "Multicolor",
    brand: "Pearson",
    description: "Hardcover textbook with highlighted chapter 5 and name written on the first page.",
    status: "open",
    reporterName: "Suvin Kithmal",
    contactMethod: "Phone",
    tags: ["book", "math", "highlighted"],
    rewardOffered: false,
    rewardAmount: 0,
    claimCount: 0,
    views: 27,
    image: "",
  },
  {
    _id: "l8",
    title: "iPad Air with Apple Pencil",
    category: "Gadgets",
    lostLocation: "Business Building Room 112",
    dateLost: "2026-03-20",
    color: "Space Gray",
    brand: "Apple",
    description: "iPad Air in a navy folio case with pencil magnetically attached.",
    status: "possible_match",
    reporterName: "Ishini Dias",
    contactMethod: "Email",
    tags: ["ipad", "tablet", "apple pencil"],
    rewardOffered: true,
    rewardAmount: 4000,
    claimCount: 2,
    views: 102,
    image: "",
  },
];

const MATCH_SIGNALS = [
  "Location similarity",
  "Date proximity",
  "Color similarity",
  "Brand similarity",
  "Unique sticker / mark",
  "Bag contents / accessories",
];

const FAQS = [
  {
    q: "How do I report a lost item?",
    a: "Use the Report Lost button and fill in the item name, category, location, date, description, and an optional photo. The better the description, the easier it is to identify a match.",
  },
  {
    q: "Can I edit my report later?",
    a: "Yes. You can open My Reports and update details such as title, description, location, or contact method. This is useful when you remember more details later.",
  },
  {
    q: "How does matching work?",
    a: "The system compares category, location, date range, and descriptive clues. Reports with strong overlap can be flagged as possible matches for review.",
  },
  {
    q: "Can I offer a reward?",
    a: "Yes. This page supports a reward indicator so honest finders know there is a thank-you reward available. The amount is fully optional.",
  },
  {
    q: "Is the Found Portal separate?",
    a: "Yes. In your project flow, the Lost Portal is your area and the Found Portal is handled separately. The browse page keeps a placeholder entry point for that linked module.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Computer Science • 2026",
    stars: "⭐⭐⭐⭐⭐",
    text: "I thought my thesis notes were gone forever. UniFind helped me locate my backpack within two days because the report looked detailed and trustworthy.",
  },
  {
    name: "Michael Chen",
    role: "Business Management • 2025",
    stars: "⭐⭐⭐⭐⭐",
    text: "The page looks professional and easy to use. The filters and cards make it much easier than checking random social posts or notices on campus.",
  },
  {
    name: "Emily Rodriguez",
    role: "Engineering • 2027",
    stars: "⭐⭐⭐⭐⭐",
    text: "I found a match for my student ID quickly because the location and date filters narrowed everything down immediately.",
  },
  {
    name: "Hashitha Gomes",
    role: "Law • 2024",
    stars: "⭐⭐⭐⭐⭐",
    text: "The saved searches feature is great. I set one up for my lost keys and came back later without repeating everything.",
  },
];

const SAVED_SEARCH_PRESETS = [
  { id: "s1", name: "Recent electronics", keyword: "", category: "Electronics", sortBy: "date_desc", status: "All", dateRange: "30" },
  { id: "s2", name: "Documents today", keyword: "", category: "Documents", sortBy: "date_desc", status: "All", dateRange: "today" },
  { id: "s3", name: "Open reports only", keyword: "", category: "All", sortBy: "date_desc", status: "open", dateRange: "all" },
];

const STATUS_GUIDE = [
  {
    id: "sg1",
    title: "Open reports",
    description: "Still waiting for a valid lead or recovery update.",
    tone: "green",
  },
  {
    id: "sg2",
    title: "Possible match",
    description: "A found record may be related and needs review.",
    tone: "gold",
  },
  {
    id: "sg3",
    title: "Under review",
    description: "Extra ownership proof or admin checking is in progress.",
    tone: "neutral",
  },
  {
    id: "sg4",
    title: "Returned",
    description: "The item has been confirmed and handed back.",
    tone: "neutral",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatDate(input) {
  if (!input) return "—";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function daysAgo(dateString) {
  if (!dateString) return "Unknown";
  const ms = new Date(dateString).getTime();
  if (Number.isNaN(ms)) return "Unknown";
  const diff = Math.floor((Date.now() - ms) / 86400000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 30) return `${diff} days ago`;
  const months = Math.floor(diff / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(max, number));
}

function getDateRangeDates(type) {
  const today = new Date();
  const end = today.toISOString().split("T")[0];

  if (type === "all") {
    return { from: "", to: "" };
  }
  if (type === "today") {
    return { from: end, to: end };
  }

  const mapping = { "7": 7, "14": 14, "30": 30, "60": 60 };
  const days = mapping[type];
  if (!days) return { from: "", to: "" };

  const start = new Date(today);
  start.setDate(today.getDate() - days);
  return {
    from: start.toISOString().split("T")[0],
    to: end,
  };
}

function createStorageKey(part) {
  return `unifind_home_browse_${part}`;
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore local storage issues
  }
}

function buildSearchText(item) {
  return [
    item.title,
    item.category,
    item.description,
    item.lostLocation,
    item.brand,
    item.color,
    ...(safeArray(item.tags)),
    item.reporterName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getStatusCount(items, status) {
  return items.filter((item) => item.status === status).length;
}

function getTopCategory(items) {
  const counts = items.reduce((acc, item) => {
    const key = item.category || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return winner ? winner[0] : "—";
}

function getRecentActivityText(item) {
  const meta = STATUS_META[item.status] || STATUS_META.open;
  return `${item.title} is currently ${meta.label.toLowerCase()} and was reported ${daysAgo(item.dateLost).toLowerCase()}.`;
}

function getMatchScore(item) {
  let score = 40;
  if (item.status === "possible_match") score += 25;
  if (safeArray(item.tags).length >= 3) score += 10;
  if (item.rewardOffered) score += 5;
  if ((item.views || 0) > 60) score += 8;
  if ((item.claimCount || 0) > 1) score += 7;
  return clamp(score, 0, 98);
}

function buildCSV(items) {
  const headers = [
    "ID",
    "Title",
    "Category",
    "Status",
    "Date Lost",
    "Location",
    "Brand",
    "Color",
    "Views",
    "Claim Count",
    "Reward Offered",
  ];
  const rows = items.map((item) => [
    item._id,
    item.title,
    item.category,
    item.status,
    item.dateLost,
    item.lostLocation,
    item.brand || "",
    item.color || "",
    item.views || 0,
    item.claimCount || 0,
    item.rewardOffered ? "Yes" : "No",
  ]);

  return [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            return `"${value.replaceAll('"', '""')}"`;
          }
          return value;
        })
        .join(",")
    )
    .join("\n");
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.setAttribute("download", filename);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}


// ─────────────────────────────────────────────────────────────────────────────
// PRESENTATIONAL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function SoftBadge({ children, tone = "gold", filled = false }) {
  const styles = {
    gold: { color: "var(--uf-gold)", background: filled ? "linear-gradient(135deg,var(--uf-amber),var(--uf-gold))" : "rgba(216,139,18,0.09)", border: filled ? "none" : "1px solid rgba(216,139,18,0.18)" },
    green: { color: "var(--uf-green)", background: filled ? "linear-gradient(135deg,#2ecc71,#1f8b54)" : "rgba(31,139,84,0.10)", border: filled ? "none" : "1px solid rgba(31,139,84,0.18)" },
    neutral: { color: "var(--uf-ink-soft)", background: "rgba(31,20,8,0.05)", border: "1px solid rgba(31,20,8,0.08)" },
    red: { color: "var(--uf-red)", background: "rgba(197,78,56,0.10)", border: "1px solid rgba(197,78,56,0.18)" },
  };
  const s = styles[tone] || styles.gold;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".35rem",
        padding: ".32rem .8rem",
        borderRadius: "999px",
        fontSize: ".7rem",
        fontWeight: 800,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        color: filled ? "white" : s.color,
        background: s.background,
        border: s.border,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.open;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".42rem",
        background: meta.bg,
        color: meta.tone,
        borderRadius: "999px",
        padding: ".34rem .78rem",
        fontSize: ".68rem",
        fontWeight: 800,
        letterSpacing: ".06em",
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: meta.dot,
          display: "inline-block",
          animation: "ufShimmer 1.8s ease-in-out infinite",
        }}
      />
      {meta.label}
    </span>
  );
}

function CategoryPill({ category }) {
  const icon = CATEGORY_ICONS[category] || "📦";
  return (
    <span
      className="uf-chip"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".38rem",
        padding: ".32rem .8rem",
        borderRadius: "999px",
        fontSize: ".72rem",
        fontWeight: 700,
        letterSpacing: ".02em",
        color: "var(--uf-gold)",
        background: "rgba(216,139,18,0.09)",
        border: "1px solid rgba(216,139,18,0.12)",
      }}
    >
      <span>{icon}</span>
      <span>{category || "Other"}</span>
    </span>
  );
}

function StatTile({ icon, value, label, helper, delay = "" }) {
  return (
    <div
      className={`uf-card uf-animate ${delay}`}
      style={{
        flex: 1,
        minWidth: 180,
        background: "rgba(255,252,246,0.92)",
        border: "1px solid var(--uf-line)",
        borderRadius: "var(--uf-r-md)",
        padding: "1.2rem 1.2rem 1.1rem",
        boxShadow: "var(--uf-shadow-sm)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 14,
          top: 10,
          fontSize: "2.4rem",
          opacity: 0.11,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontFamily: "var(--uf-display)",
          fontSize: "2rem",
          fontWeight: 800,
          lineHeight: 1,
          color: "var(--uf-amber)",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: ".45rem",
          fontSize: ".72rem",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          fontWeight: 800,
          color: "var(--uf-ink-fade)",
        }}
      >
        {label}
      </div>

      {helper && (
        <div
          style={{
            marginTop: ".45rem",
            fontSize: ".8rem",
            color: "var(--uf-ink-soft)",
            lineHeight: 1.5,
          }}
        >
          {helper}
        </div>
      )}
    </div>
  );
}

function SectionHeading({ badge, title, subtitle, rightContent }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: "1rem",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        {badge && (
          <div style={{ marginBottom: ".7rem" }}>
            <SoftBadge tone="gold">
              <Icon.Sparkle />
              {badge}
            </SoftBadge>
          </div>
        )}

        <h2
          style={{
            fontFamily: "var(--uf-display)",
            fontSize: "clamp(1.7rem, 3vw, 2.6rem)",
            letterSpacing: "-.03em",
            lineHeight: 1.1,
            color: "var(--uf-ink)",
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              marginTop: ".55rem",
              color: "var(--uf-ink-soft)",
              fontSize: ".94rem",
              lineHeight: 1.7,
              maxWidth: 680,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {rightContent ? <div>{rightContent}</div> : null}
    </div>
  );
}

function TopTicker({ items }) {
  const texts = items.slice(0, 10).map((item) => {
    const icon = CATEGORY_ICONS[item.category] || "📦";
    const status = STATUS_META[item.status]?.label || "Open";
    return `${icon} ${item.title} • ${status} • ${item.lostLocation}`;
  });
  const duplicated = [...texts, ...texts];

  return (
    <div
      style={{
        background:
          "linear-gradient(90deg, var(--uf-amber), var(--uf-gold), var(--uf-gold-2), var(--uf-amber))",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div
        className="uf-marquee"
        style={{
          display: "inline-flex",
          minWidth: "200%",
          padding: ".64rem 0",
        }}
      >
        {duplicated.map((text, index) => (
          <span
            key={`${text}-${index}`}
            style={{
              padding: "0 1.6rem",
              color: "white",
              fontSize: ".74rem",
              fontWeight: 800,
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

function Logo({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".9rem",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          background: "linear-gradient(135deg,var(--uf-amber),var(--uf-gold))",
          boxShadow: "0 18px 30px rgba(216,139,18,0.28)",
          display: "grid",
          placeItems: "center",
          color: "white",
          position: "relative",
        }}
      >
        <Icon.Search />
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#fff2c9",
            position: "absolute",
            top: -4,
            right: -4,
            border: "2px solid white",
            animation: "ufPulse 2s ease-in-out infinite",
          }}
        />
      </div>

      <div>
        <div
          style={{
            fontFamily: "var(--uf-display)",
            fontSize: "1.8rem",
            lineHeight: 1,
            fontWeight: 800,
            background: "linear-gradient(135deg, var(--uf-ink), var(--uf-gold))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          UniFind
        </div>
        <div
          style={{
            fontSize: ".62rem",
            marginTop: ".16rem",
            textTransform: "uppercase",
            letterSpacing: ".14em",
            color: "var(--uf-ink-fade)",
            fontWeight: 800,
          }}
        >
          Lost & Found Portal
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "18px 120px 1fr",
        gap: ".7rem",
        alignItems: "center",
      }}
    >
      <div style={{ color: "var(--uf-gold)", display: "flex", alignItems: "center" }}>{icon}</div>
      <div
        style={{
          fontSize: ".73rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: ".08em",
          color: "var(--uf-ink-fade)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: ".9rem",
          fontWeight: 600,
          color: "var(--uf-ink-soft)",
          lineHeight: 1.6,
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        padding: "4.5rem 1.5rem",
        borderRadius: "var(--uf-r-xl)",
        border: "1px dashed rgba(216,139,18,0.22)",
        background: "linear-gradient(145deg, rgba(255,251,245,0.9), rgba(248,239,225,0.7))",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3.8rem", marginBottom: ".8rem", animation: "ufFloatA 3.4s ease-in-out infinite" }}>🔎</div>
      <h3
        style={{
          fontFamily: "var(--uf-display)",
          fontSize: "1.7rem",
          letterSpacing: "-.03em",
          color: "var(--uf-ink)",
          marginBottom: ".55rem",
        }}
      >
        No items match your filters
      </h3>
      <p
        style={{
          maxWidth: 520,
          margin: "0 auto",
          color: "var(--uf-ink-soft)",
          lineHeight: 1.7,
          fontSize: ".92rem",
        }}
      >
        Try changing the category, keyword, date range, status, or sort order. A clear and wider search often helps reveal older reports.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="uf-btn"
        style={{
          marginTop: "1.2rem",
          border: "1px solid var(--uf-line)",
          background: "white",
          color: "var(--uf-gold)",
          borderRadius: "999px",
          padding: ".8rem 1.3rem",
          fontWeight: 800,
          fontSize: ".82rem",
          cursor: "pointer",
        }}
      >
        Clear all filters
      </button>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--uf-bg)",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            border: "3px solid rgba(216,139,18,0.16)",
            borderTopColor: "var(--uf-amber)",
            animation: "ufSpin .9s linear infinite",
            margin: "0 auto 1rem",
          }}
        />
        <div
          style={{
            fontFamily: "var(--uf-display)",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--uf-gold)",
          }}
        >
          Loading lost reports…
        </div>
      </div>
    </div>
  );
}


function MetricCard({ icon, title, value, caption, tone = "gold" }) {
  const palette = {
    gold: { bg: "rgba(216,139,18,0.10)", tone: "var(--uf-gold)" },
    green: { bg: "rgba(31,139,84,0.12)", tone: "var(--uf-green)" },
    amber: { bg: "rgba(229,108,24,0.12)", tone: "var(--uf-amber)" },
    neutral: { bg: "rgba(31,20,8,0.06)", tone: "var(--uf-ink-soft)" },
  };
  const p = palette[tone] || palette.gold;

  return (
    <div
      className="uf-dashboard-tile uf-card"
      style={{
        background: "white",
        border: "1px solid var(--uf-line-soft)",
        borderRadius: "var(--uf-r-md)",
        padding: "1.1rem",
        boxShadow: "var(--uf-shadow-sm)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".8rem" }}>
        <div>
          <div
            style={{
              fontSize: ".72rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              color: "var(--uf-ink-fade)",
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: ".4rem",
              fontFamily: "var(--uf-display)",
              fontSize: "1.8rem",
              fontWeight: 800,
              lineHeight: 1,
              color: "var(--uf-ink)",
            }}
          >
            {value}
          </div>

          {caption && (
            <div
              style={{
                marginTop: ".5rem",
                fontSize: ".82rem",
                color: "var(--uf-ink-soft)",
                lineHeight: 1.55,
              }}
            >
              {caption}
            </div>
          )}
        </div>

        <div
          className="uf-dashboard-icon"
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            background: p.bg,
            color: p.tone,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  viewMode,
  onView,
  onEdit,
  onToggleFavorite,
  onToggleBookmark,
  onCompare,
  isFavorite,
  isBookmarked,
}) {
  const imageUrl = item?.image
    ? item.image.startsWith("http")
      ? item.image
      : `http://localhost:5001${item.image}`
    : "";

  const compact = viewMode === "compact";
  const score = getMatchScore(item);

  return (
    <article
      className="uf-card"
      style={{
        background: "white",
        border: "1px solid var(--uf-line-soft)",
        borderRadius: "var(--uf-r-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: compact ? 360 : 460,
        boxShadow: "var(--uf-shadow-md)",
      }}
    >
      <div
        style={{
          height: compact ? 160 : 210,
          background: "linear-gradient(145deg, #f6ead8, #fff5e9)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="uf-card-image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "grid",
              placeItems: "center",
              color: "var(--uf-ink-fade)",
              position: "relative",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: compact ? "2.7rem" : "3.4rem", animation: "ufFloatB 4s ease-in-out infinite" }}>
                {CATEGORY_ICONS[item.category] || "📦"}
              </div>
              <div style={{ fontSize: ".76rem", marginTop: ".35rem", fontWeight: 700 }}>
                No image uploaded
              </div>
            </div>
          </div>
        )}

        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <CategoryPill category={item.category} />
        </div>

        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <StatusBadge status={item.status} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            display: "flex",
            gap: ".5rem",
            flexWrap: "wrap",
          }}
        >
          <SoftBadge tone="neutral">
            <Icon.Clock />
            {daysAgo(item.dateLost)}
          </SoftBadge>

          {item.rewardOffered && (
            <SoftBadge tone="gold" filled>
              LKR {item.rewardAmount}
            </SoftBadge>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            right: 12,
            bottom: 12,
            display: "flex",
            gap: ".45rem",
          }}
        >
          <button
            type="button"
            className="uf-btn"
            onClick={() => onToggleFavorite(item._id)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(31,20,8,0.45)",
              backdropFilter: "blur(10px)",
              color: "white",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
            title="Favorite"
          >
            <Icon.Heart filled={isFavorite} />
          </button>

          <button
            type="button"
            className="uf-btn"
            onClick={() => onToggleBookmark(item._id)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(31,20,8,0.45)",
              backdropFilter: "blur(10px)",
              color: "white",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
            title="Bookmark"
          >
            <Icon.Bookmark filled={isBookmarked} />
          </button>
        </div>
      </div>

      <div style={{ padding: compact ? "1.1rem" : "1.35rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            fontFamily: "var(--uf-display)",
            fontSize: compact ? "1.08rem" : "1.25rem",
            lineHeight: 1.25,
            fontWeight: 700,
            color: "var(--uf-ink)",
            letterSpacing: "-.02em",
          }}
        >
          {item.title}
        </div>

        <p
          style={{
            marginTop: ".7rem",
            fontSize: ".86rem",
            lineHeight: 1.65,
            color: "var(--uf-ink-soft)",
            display: "-webkit-box",
            WebkitLineClamp: compact ? 2 : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description || "No extra description was provided."}
        </p>

        <div style={{ marginTop: ".95rem", display: "grid", gap: ".55rem" }}>
          <InfoRow icon={<Icon.Pin />} label="Location" value={item.lostLocation} />
          <InfoRow icon={<Icon.Calendar />} label="Date Lost" value={formatDate(item.dateLost)} />
          <InfoRow icon={<Icon.User />} label="Reporter" value={item.reporterName} />
        </div>

        <div
          style={{
            marginTop: ".95rem",
            borderRadius: "var(--uf-r-sm)",
            background: "rgba(216,139,18,0.06)",
            border: "1px solid rgba(216,139,18,0.10)",
            padding: ".8rem .9rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: ".8rem", marginBottom: ".35rem" }}>
            <div style={{ fontSize: ".72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--uf-ink-fade)" }}>
              Match confidence
            </div>
            <div style={{ fontSize: ".82rem", fontWeight: 800, color: "var(--uf-gold)" }}>{score}%</div>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: "rgba(31,20,8,0.06)", overflow: "hidden" }}>
            <div
              style={{
                width: `${score}%`,
                height: "100%",
                background: "linear-gradient(90deg, var(--uf-amber), var(--uf-gold))",
                borderRadius: 999,
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem", marginTop: ".95rem" }}>
          {safeArray(item.tags).slice(0, compact ? 3 : 5).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: ".72rem",
                color: "var(--uf-ink-soft)",
                background: "rgba(31,20,8,0.05)",
                border: "1px solid rgba(31,20,8,0.08)",
                borderRadius: "999px",
                padding: ".28rem .65rem",
                fontWeight: 700,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "auto", display: "flex", gap: ".65rem", flexWrap: "wrap", paddingTop: "1rem" }}>
          <button
            type="button"
            onClick={() => onView(item)}
            className="uf-btn"
            style={{
              flex: 1,
              minWidth: 140,
              borderRadius: "999px",
              background: "linear-gradient(135deg, var(--uf-ink), #4f3823)",
              color: "white",
              border: "none",
              padding: ".82rem 1rem",
              fontWeight: 800,
              fontSize: ".82rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".45rem",
            }}
          >
            <Icon.Eye />
            View details
          </button>

          <button
            type="button"
            onClick={() => onEdit(item)}
            className="uf-btn"
            style={{
              borderRadius: "999px",
              background: "white",
              color: "var(--uf-gold)",
              border: "1px solid var(--uf-line)",
              padding: ".82rem 1rem",
              fontWeight: 800,
              fontSize: ".82rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".45rem",
            }}
          >
            <Icon.Edit />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onCompare(item._id)}
            className="uf-btn"
            style={{
              borderRadius: "999px",
              background: "rgba(216,139,18,0.08)",
              color: "var(--uf-gold)",
              border: "1px solid rgba(216,139,18,0.16)",
              padding: ".82rem 1rem",
              fontWeight: 800,
              fontSize: ".82rem",
              cursor: "pointer",
            }}
          >
            Compare
          </button>
        </div>
      </div>
    </article>
  );
}

function SavedSearchCard({ search, onApply, onRemove }) {
  return (
    <div
      className="uf-card"
      style={{
        background: "white",
        border: "1px solid var(--uf-line-soft)",
        borderRadius: "var(--uf-r-md)",
        padding: "1rem",
        boxShadow: "var(--uf-shadow-sm)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: ".8rem", alignItems: "start" }}>
        <div>
          <div
            style={{
              fontSize: ".92rem",
              fontWeight: 800,
              color: "var(--uf-ink)",
            }}
          >
            {search.name}
          </div>
          <div
            style={{
              fontSize: ".8rem",
              color: "var(--uf-ink-soft)",
              marginTop: ".35rem",
              lineHeight: 1.55,
            }}
          >
            {search.keyword ? `Keyword: "${search.keyword}"` : "No keyword"} • {search.category} • {search.status}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(search.id)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 12,
            border: "1px solid var(--uf-line)",
            background: "white",
            color: "var(--uf-ink-fade)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Icon.Close />
        </button>
      </div>

      <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: ".9rem" }}>
        <button
          type="button"
          onClick={() => onApply(search)}
          className="uf-btn"
          style={{
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, var(--uf-amber), var(--uf-gold))",
            color: "white",
            padding: ".7rem 1rem",
            borderRadius: "999px",
            fontWeight: 800,
            fontSize: ".78rem",
          }}
        >
          Apply search
        </button>

        <div style={{ display: "inline-flex", alignItems: "center", gap: ".3rem" }}>
          <span className="uf-kbd">S</span>
          <span style={{ fontSize: ".72rem", color: "var(--uf-ink-fade)", fontWeight: 700 }}>
            shortcut idea
          </span>
        </div>
      </div>
    </div>
  );
}

function NotificationCard({ title, text, tone = "gold", time = "Just now" }) {
  const palette = {
    gold: { bg: "rgba(216,139,18,0.08)", border: "rgba(216,139,18,0.14)", color: "var(--uf-gold)" },
    green: { bg: "rgba(31,139,84,0.08)", border: "rgba(31,139,84,0.16)", color: "var(--uf-green)" },
    neutral: { bg: "rgba(31,20,8,0.05)", border: "rgba(31,20,8,0.08)", color: "var(--uf-ink-soft)" },
  };
  const p = palette[tone] || palette.gold;

  return (
    <div
      style={{
        background: p.bg,
        border: `1px solid ${p.border}`,
        borderRadius: "var(--uf-r-sm)",
        padding: ".9rem 1rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: ".8rem", marginBottom: ".35rem" }}>
        <div style={{ fontWeight: 800, color: p.color, fontSize: ".84rem" }}>{title}</div>
        <div style={{ color: "var(--uf-ink-fade)", fontSize: ".72rem", fontWeight: 700 }}>{time}</div>
      </div>
      <div style={{ color: "var(--uf-ink-soft)", fontSize: ".82rem", lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function ActivityTimeline({ item }) {
  const baseSteps = [
    { label: "Report created", date: item.dateLost, tone: "gold", note: "Initial report submitted by owner." },
    { label: "Portal visibility", date: item.dateLost, tone: "neutral", note: "Item is visible on the browse page." },
    {
      label: item.status === "possible_match" ? "Possible match detected" : item.status === "closed" ? "Ownership confirmed" : "Awaiting claim activity",
      date: item.dateLost,
      tone: item.status === "closed" ? "green" : "gold",
      note: getRecentActivityText(item),
    },
  ];

  return (
    <div style={{ display: "grid", gap: ".9rem" }}>
      {baseSteps.map((step, index) => (
        <div key={`${step.label}-${index}`} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: ".8rem" }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: step.tone === "green" ? "var(--uf-green)" : step.tone === "gold" ? "var(--uf-gold)" : "var(--uf-ink-fade)",
                marginTop: 4,
                boxShadow: step.tone === "gold" ? "0 0 0 6px rgba(216,139,18,0.08)" : "none",
              }}
            />
            {index < baseSteps.length - 1 && (
              <div
                style={{
                  width: 2,
                  background: "rgba(31,20,8,0.08)",
                  position: "absolute",
                  top: 20,
                  bottom: -20,
                  left: 6,
                }}
              />
            )}
          </div>

          <div
            style={{
              paddingBottom: ".95rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: ".8rem", flexWrap: "wrap" }}>
              <div style={{ fontSize: ".92rem", fontWeight: 800, color: "var(--uf-ink)" }}>{step.label}</div>
              <div style={{ fontSize: ".76rem", color: "var(--uf-ink-fade)", fontWeight: 700 }}>{formatDate(step.date)}</div>
            </div>
            <div style={{ marginTop: ".35rem", color: "var(--uf-ink-soft)", fontSize: ".82rem", lineHeight: 1.6 }}>{step.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComparePanel({ selectedItems, allItems, onRemove, onClear }) {
  const compared = allItems.filter((item) => selectedItems.includes(item._id));

  return (
    <section
      className="uf-soft-panel"
      style={{
        padding: "1.2rem",
        marginBottom: "2rem",
      }}
    >
      <SectionHeading
        badge="Quick Compare"
        title="Compare selected reports"
        subtitle="This mini compare panel helps you check the main identifying clues side by side."
        rightContent={
          compared.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="uf-btn"
              style={{
                background: "white",
                border: "1px solid var(--uf-line)",
                color: "var(--uf-gold)",
                borderRadius: "999px",
                padding: ".7rem 1rem",
                fontWeight: 800,
                fontSize: ".8rem",
                cursor: "pointer",
              }}
            >
              Clear compare
            </button>
          ) : null
        }
      />

      {compared.length === 0 ? (
        <div
          style={{
            borderRadius: "var(--uf-r-md)",
            border: "1px dashed rgba(216,139,18,0.24)",
            background: "rgba(255,255,255,0.65)",
            padding: "1.3rem",
            color: "var(--uf-ink-soft)",
            fontSize: ".9rem",
          }}
        >
          No items selected yet. Press the <strong>Compare</strong> button on a card to add it here.
        </div>
      ) : (
        <div className="uf-grid-3">
          {compared.map((item) => (
            <div
              key={item._id}
              style={{
                background: "white",
                borderRadius: "var(--uf-r-md)",
                border: "1px solid var(--uf-line-soft)",
                padding: "1rem",
                boxShadow: "var(--uf-shadow-sm)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: ".8rem", marginBottom: ".8rem" }}>
                <div>
                  <div style={{ fontWeight: 800, color: "var(--uf-ink)" }}>{item.title}</div>
                  <div style={{ marginTop: ".35rem" }}>
                    <CategoryPill category={item.category} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(item._id)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    border: "1px solid var(--uf-line)",
                    background: "white",
                    color: "var(--uf-ink-fade)",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon.Close />
                </button>
              </div>

              <div style={{ display: "grid", gap: ".55rem" }}>
                <InfoRow icon={<Icon.Pin />} label="Location" value={item.lostLocation} />
                <InfoRow icon={<Icon.Calendar />} label="Date" value={formatDate(item.dateLost)} />
                <InfoRow icon={<Icon.Layers />} label="Brand" value={item.brand} />
                <InfoRow icon={<Icon.Info />} label="Color" value={item.color} />
              </div>

              <div style={{ marginTop: ".8rem" }}>
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


function DetailsDrawer({
  item,
  open,
  onClose,
  onToggleFavorite,
  onToggleBookmark,
  isFavorite,
  isBookmarked,
}) {
  if (!open || !item) return null;

  const score = getMatchScore(item);
  const imageUrl = item?.image
    ? item.image.startsWith("http")
      ? item.image
      : `http://localhost:5001${item.image}`
    : "";
  const matchSignals = MATCH_SIGNALS.slice(0, Math.max(2, Math.min(5, Math.floor(score / 18))));

  return (
    <div
      className="uf-overlay"
      onClick={onClose}
      style={{
        padding: "1.25rem",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(1120px, 100%)",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #fffdf9 0%, #fff8ef 100%)",
          border: "1px solid var(--uf-line)",
          borderRadius: "32px",
          boxShadow: "var(--uf-shadow-xl)",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            background: "rgba(255, 250, 242, 0.92)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid var(--uf-line-soft)",
            padding: "1rem 1.2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: ".8rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: ".72rem",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "var(--uf-ink-fade)",
                fontWeight: 800,
              }}
            >
              Lost item details
            </div>
            <div
              style={{
                marginTop: ".2rem",
                fontWeight: 800,
                color: "var(--uf-ink)",
                fontSize: "1rem",
              }}
            >
              {item.title}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="uf-btn"
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              border: "1px solid var(--uf-line)",
              background: "white",
              color: "var(--uf-ink-soft)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Icon.Close />
          </button>
        </div>

        <div style={{ padding: "1.2rem", display: "grid", gap: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, .95fr)",
              gap: "1rem",
            }}
          >
            <div
              style={{
                minHeight: 420,
                background: "linear-gradient(145deg, #f8eee0, #fff8ee)",
                borderRadius: "26px",
                border: "1px solid var(--uf-line-soft)",
                overflow: "hidden",
                position: "relative",
                display: "grid",
                placeItems: "center",
                padding: "1rem",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: 380,
                    objectFit: "contain",
                    borderRadius: "18px",
                  }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "var(--uf-ink-fade)" }}>
                  <div style={{ fontSize: "5rem", marginBottom: ".5rem" }}>
                    {CATEGORY_ICONS[item.category] || "📦"}
                  </div>
                  <div style={{ fontWeight: 700 }}>No image available</div>
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  display: "flex",
                  gap: ".5rem",
                  flexWrap: "wrap",
                }}
              >
                <CategoryPill category={item.category} />
                <StatusBadge status={item.status} />
              </div>

              <div
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 16,
                  display: "flex",
                  gap: ".6rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item._id)}
                  className="uf-btn"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: "rgba(31,20,8,0.42)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon.Heart filled={isFavorite} />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleBookmark(item._id)}
                  className="uf-btn"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: "rgba(31,20,8,0.42)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon.Bookmark filled={isBookmarked} />
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div
                className="uf-soft-panel"
                style={{
                  padding: "1.1rem 1.15rem",
                  background: "rgba(255,255,255,0.82)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: ".8rem",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--uf-display)",
                        fontSize: "1.8rem",
                        lineHeight: 1.1,
                        letterSpacing: "-.03em",
                        color: "var(--uf-ink)",
                      }}
                    >
                      {item.title}
                    </h3>
                    <div
                      style={{
                        marginTop: ".45rem",
                        color: "var(--uf-ink-soft)",
                        fontSize: ".88rem",
                      }}
                    >
                      Reported by <strong>{item.reporterName || "Unknown user"}</strong>
                      {item.contactMethod ? ` • Contact: ${item.contactMethod}` : ""}
                    </div>
                  </div>

                  {item.rewardOffered ? (
                    <SoftBadge tone="gold" filled>
                      Reward LKR {item.rewardAmount}
                    </SoftBadge>
                  ) : (
                    <SoftBadge tone="neutral">No reward</SoftBadge>
                  )}
                </div>

                <p
                  style={{
                    marginTop: ".95rem",
                    fontSize: ".92rem",
                    lineHeight: 1.75,
                    color: "var(--uf-ink-soft)",
                  }}
                >
                  {item.description || "No description provided yet."}
                </p>

                <div style={{ marginTop: "1rem", display: "grid", gap: ".7rem" }}>
                  <InfoRow icon={<Icon.Pin />} label="Lost location" value={item.lostLocation || "Not specified"} />
                  <InfoRow icon={<Icon.Calendar />} label="Date lost" value={formatDate(item.dateLost)} />
                  <InfoRow icon={<Icon.Layers />} label="Brand" value={item.brand || "Not specified"} />
                  <InfoRow icon={<Icon.Info />} label="Color" value={item.color || "Not specified"} />
                  <InfoRow
                    icon={<Icon.Chart />}
                    label="Views / claims"
                    value={`${item.views || 0} views • ${item.claimCount || 0} claim(s)`}
                  />
                </div>
              </div>

              <div
                className="uf-soft-panel"
                style={{
                  padding: "1.05rem 1.15rem",
                  background: "rgba(255,255,255,0.82)",
                }}
              >
                <div style={{ fontWeight: 800, color: "var(--uf-ink)", marginBottom: ".85rem" }}>
                  Match confidence
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: ".55rem", marginBottom: ".9rem" }}>
                  {matchSignals.map((signal) => (
                    <SoftBadge key={signal} tone="gold">
                      <Icon.Target />
                      {signal}
                    </SoftBadge>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: ".7rem",
                    marginBottom: ".35rem",
                    fontSize: ".76rem",
                    fontWeight: 800,
                    color: "var(--uf-ink-fade)",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                  }}
                >
                  <span>Confidence score</span>
                  <span style={{ color: "var(--uf-gold)" }}>{score}%</span>
                </div>

                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "rgba(31,20,8,0.07)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${score}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, var(--uf-amber), var(--uf-gold))",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>

              <div
                className="uf-soft-panel"
                style={{
                  padding: "1.05rem 1.15rem",
                  background: "rgba(255,255,255,0.82)",
                }}
              >
                <div style={{ fontWeight: 800, color: "var(--uf-ink)", marginBottom: ".85rem" }}>
                  Tags and clues
                </div>
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                  {safeArray(item.tags).length > 0 ? (
                    safeArray(item.tags).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: ".76rem",
                          padding: ".35rem .72rem",
                          borderRadius: "999px",
                          background: "white",
                          border: "1px solid var(--uf-line)",
                          color: "var(--uf-ink-soft)",
                          fontWeight: 700,
                        }}
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <div style={{ color: "var(--uf-ink-soft)", fontSize: ".86rem" }}>
                      No tags provided yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="uf-soft-panel"
            style={{
              padding: "1.1rem 1.15rem",
              background: "rgba(255,255,255,0.82)",
            }}
          >
            <div style={{ fontWeight: 800, color: "var(--uf-ink)", marginBottom: ".95rem" }}>
              Activity timeline
            </div>
            <ActivityTimeline item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateSavedSearchModal({ open, onClose, onSave, searchState }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="uf-overlay" onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(100%, 520px)",
          background: "linear-gradient(180deg, #fffdf9, #fff7ed)",
          border: "1px solid var(--uf-line)",
          boxShadow: "var(--uf-shadow-xl)",
          borderRadius: "var(--uf-r-lg)",
          padding: "1.3rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: ".8rem", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--uf-ink)", fontSize: "1rem" }}>Save current search</div>
            <div style={{ marginTop: ".25rem", color: "var(--uf-ink-soft)", fontSize: ".84rem" }}>
              Store your current filter setup so you can re-open it later.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              border: "1px solid var(--uf-line)",
              background: "white",
              color: "var(--uf-ink-soft)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Icon.Close />
          </button>
        </div>

        <div style={{ display: "grid", gap: ".9rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: ".4rem", fontSize: ".72rem", fontWeight: 800, color: "var(--uf-ink-fade)", textTransform: "uppercase", letterSpacing: ".08em" }}>
              Saved search name
            </label>
            <div className="uf-input-shell" style={{ background: "white", border: "1px solid var(--uf-line)", borderRadius: "999px", padding: ".82rem 1rem" }}>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Recent blue backpacks"
                style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: ".88rem", color: "var(--uf-ink)" }}
              />
            </div>
          </div>

          <div className="uf-soft-panel" style={{ padding: "1rem" }}>
            <div style={{ fontWeight: 800, color: "var(--uf-ink)", marginBottom: ".6rem" }}>Current setup preview</div>
            <div style={{ fontSize: ".84rem", color: "var(--uf-ink-soft)", lineHeight: 1.7 }}>
              Keyword: <strong>{searchState.keyword || "None"}</strong><br />
              Category: <strong>{searchState.category}</strong><br />
              Status: <strong>{searchState.status}</strong><br />
              Sort: <strong>{searchState.sortBy}</strong><br />
              Date range: <strong>{searchState.dateFrom || "Any"} → {searchState.dateTo || "Any"}</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: ".7rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={onClose}
              className="uf-btn"
              style={{
                borderRadius: "999px",
                background: "white",
                color: "var(--uf-ink-soft)",
                border: "1px solid var(--uf-line)",
                padding: ".8rem 1.2rem",
                fontWeight: 800,
                fontSize: ".82rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                if (!name.trim()) return;
                onSave(name.trim());
              }}
              className="uf-btn"
              style={{
                borderRadius: "999px",
                background: "linear-gradient(135deg, var(--uf-amber), var(--uf-gold))",
                color: "white",
                border: "none",
                padding: ".8rem 1.2rem",
                fontWeight: 800,
                fontSize: ".82rem",
                cursor: "pointer",
              }}
            >
              Save search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function HomeBrowsePage() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("lost");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverNotice, setServerNotice] = useState("");
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [quickRange, setQuickRange] = useState("all");

  const [viewMode, setViewMode] = useState(readStorage(createStorageKey("view_mode"), "comfortable"));
  const [showAdvanced, setShowAdvanced] = useState(readStorage(createStorageKey("show_advanced"), true));
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [favorites, setFavorites] = useState(readStorage(createStorageKey("favorites"), []));
  const [bookmarks, setBookmarks] = useState(readStorage(createStorageKey("bookmarks"), []));
  const [savedSearches, setSavedSearches] = useState(readStorage(createStorageKey("saved_searches"), SAVED_SEARCH_PRESETS));
  const [compareIds, setCompareIds] = useState(readStorage(createStorageKey("compare_ids"), []));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "compact" ? 8 : 6;

  useEffect(() => {
    writeStorage(createStorageKey("favorites"), favorites);
  }, [favorites]);

  useEffect(() => {
    writeStorage(createStorageKey("bookmarks"), bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    writeStorage(createStorageKey("saved_searches"), savedSearches);
  }, [savedSearches]);

  useEffect(() => {
    writeStorage(createStorageKey("compare_ids"), compareIds);
  }, [compareIds]);

  useEffect(() => {
    writeStorage(createStorageKey("view_mode"), viewMode);
  }, [viewMode]);

  useEffect(() => {
    writeStorage(createStorageKey("show_advanced"), showAdvanced);
  }, [showAdvanced]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getLostItems();
        const data = result?.data || result;

        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          setServerNotice("");
        } else {
          setItems(SAMPLE_ITEMS);
          setServerNotice("Live API returned no records, so sample items are displayed for a fuller preview.");
        }
      } catch (fetchError) {
        setItems(SAMPLE_ITEMS);
        setError("Unable to connect to the API right now. Showing local sample data instead.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category, status, sortBy, dateFrom, dateTo, viewMode]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        setShowSavedModal(true);
      }

      if (event.key === "Escape") {
        setSelectedItemId(null);
        setShowSavedModal(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectedItem = useMemo(
    () => items.find((item) => item._id === selectedItemId) || null,
    [items, selectedItemId]
  );

  const categories = useMemo(() => {
    const unique = [...new Set(items.map((item) => item.category).filter(Boolean))];
    return ["All", ...unique];
  }, [items]);

  const statuses = ["All", "open", "possible_match", "under_review", "closed"];

  const searchState = {
    keyword,
    category,
    status,
    sortBy,
    dateFrom,
    dateTo,
  };

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (category !== "All") {
      result = result.filter((item) => item.category === category);
    }

    if (status !== "All") {
      result = result.filter((item) => item.status === status);
    }

    const normalizedKeyword = normalizeText(keyword);
    if (normalizedKeyword) {
      result = result.filter((item) => buildSearchText(item).includes(normalizedKeyword));
    }

    if (dateFrom) {
      result = result.filter((item) => String(item.dateLost || "").split("T")[0] >= dateFrom);
    }

    if (dateTo) {
      result = result.filter((item) => String(item.dateLost || "").split("T")[0] <= dateTo);
    }

    switch (sortBy) {
      case "date_asc":
        result.sort((a, b) => new Date(a.dateLost) - new Date(b.dateLost));
        break;
      case "title_asc":
        result.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
        break;
      case "title_desc":
        result.sort((a, b) => String(b.title || "").localeCompare(String(a.title || "")));
        break;
      case "views_desc":
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "claims_desc":
        result.sort((a, b) => (b.claimCount || 0) - (a.claimCount || 0));
        break;
      case "match_desc":
        result.sort((a, b) => getMatchScore(b) - getMatchScore(a));
        break;
      default:
        result.sort((a, b) => new Date(b.dateLost) - new Date(a.dateLost));
        break;
    }

    return result;
  }, [items, keyword, category, status, sortBy, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(
    () => filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredItems, currentPage, itemsPerPage]
  );

  const totalReports = items.length;
  const openReports = getStatusCount(items, "open");
  const matchReports = getStatusCount(items, "possible_match");
  const reviewReports = getStatusCount(items, "under_review");
  const returnedReports = getStatusCount(items, "closed");

  const bookmarkedCount = bookmarks.length;
  const favoriteCount = favorites.length;
  const compareCount = compareIds.length;
  const topCategory = getTopCategory(items);
  const recentReports = items.filter((item) => {
    if (!item.dateLost) return false;
    const diff = Date.now() - new Date(item.dateLost).getTime();
    return !Number.isNaN(diff) && diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const averageViews = items.length ? Math.round(items.reduce((sum, item) => sum + Number(item.views || 0), 0) / items.length) : 0;
  const rewardReports = items.filter((item) => Number(item.rewardAmount || 0) > 0 || item.rewardOffered).length;
  const categoryCount = new Set(items.map((item) => item.category).filter(Boolean)).size;
  const quickSummaryCards = [
    { id: "q1", icon: "📍", label: "Most active category", value: topCategory },
    { id: "q2", icon: "🗓️", label: "Reports in last 7 days", value: recentReports },
    { id: "q3", icon: "🎁", label: "Reports with reward", value: rewardReports },
    { id: "q4", icon: "👁️", label: "Average views", value: averageViews },
  ];

  const activeFilterCount = [
    Boolean(keyword),
    category !== "All",
    status !== "All",
    Boolean(dateFrom),
    Boolean(dateTo),
    sortBy !== "date_desc",
  ].filter(Boolean).length;

  const dashboardHighlights = [
    { title: "Open reports", value: openReports, caption: "Items still waiting for recovery or a clear lead.", icon: <Icon.Search />, tone: "green" },
    { title: "Possible matches", value: matchReports, caption: "Reports that may connect with found-item records.", icon: <Icon.Sparkle />, tone: "gold" },
    { title: "Under review", value: reviewReports, caption: "Cases currently being checked with extra proof.", icon: <Icon.Clock />, tone: "amber" },
    { title: "Returned items", value: returnedReports, caption: "Reports already completed successfully.", icon: <Icon.Check />, tone: "neutral" },
  ];

  const applyPresetDateRange = (type) => {
    setQuickRange(type);
    const { from, to } = getDateRangeDates(type);
    setDateFrom(from);
    setDateTo(to);
  };

  const clearFilters = () => {
    setKeyword("");
    setCategory("All");
    setStatus("All");
    setSortBy("date_desc");
    setDateFrom("");
    setDateTo("");
    setQuickRange("all");
  };

  const handleFoundPortalClick = () => {
    setActiveTab("found");
    window.alert("Found Portal belongs to Hashini's module in this project flow.");
    setTimeout(() => setActiveTab("lost"), 120);
  };

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  const handleToggleBookmark = (id) => {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  const handleAddCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((value) => value !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const handleSaveSearch = (name) => {
    const entry = {
      id: `custom-${Date.now()}`,
      name,
      keyword,
      category,
      status,
      sortBy,
      dateFrom,
      dateTo,
    };
    setSavedSearches((prev) => [entry, ...prev]);
    setShowSavedModal(false);
  };

  const handleApplySavedSearch = (search) => {
    setKeyword(search.keyword || "");
    setCategory(search.category || "All");
    setStatus(search.status || "All");
    setSortBy(search.sortBy || "date_desc");
    setDateFrom(search.dateFrom || "");
    setDateTo(search.dateTo || "");
    setQuickRange("all");
  };

  const handleRemoveSavedSearch = (id) => {
    setSavedSearches((prev) => prev.filter((entry) => entry.id !== id));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--uf-bg)",
        position: "relative",
        isolation: "isolate",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div style={{ position: "fixed", top: "-18%", right: "-10%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(216,139,18,0.10) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-16%", left: "-12%", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(229,108,24,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {items.length > 0 && <TopTicker items={items} />}

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(251,247,240,0.82)",
          backdropFilter: "blur(18px) saturate(1.3)",
          borderBottom: "1px solid var(--uf-line-soft)",
        }}
      >
        <div
          style={{
            maxWidth: 1380,
            margin: "0 auto",
            padding: ".95rem 1.3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
          className="uf-nav-wrap"
        >
          <Logo onClick={() => navigate("/")} />

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".35rem",
              background: "rgba(248,239,225,0.78)",
              border: "1px solid var(--uf-line)",
              borderRadius: "999px",
              padding: ".35rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("lost")}
              className="uf-tab"
              style={{
                border: "none",
                cursor: "pointer",
                background: activeTab === "lost" ? "linear-gradient(135deg,var(--uf-amber),var(--uf-gold))" : "transparent",
                color: activeTab === "lost" ? "white" : "var(--uf-ink-soft)",
                borderRadius: "999px",
                padding: ".62rem 1.2rem",
                fontWeight: 800,
                fontSize: ".82rem",
                boxShadow: activeTab === "lost" ? "0 10px 20px rgba(216,139,18,0.22)" : "none",
              }}
            >
              Lost Items
            </button>

            <button
              type="button"
              onClick={handleFoundPortalClick}
              className="uf-tab"
              style={{
                border: "none",
                cursor: "pointer",
                background: activeTab === "found" ? "linear-gradient(135deg,var(--uf-amber),var(--uf-gold))" : "transparent",
                color: activeTab === "found" ? "white" : "var(--uf-ink-soft)",
                borderRadius: "999px",
                padding: ".62rem 1.2rem",
                fontWeight: 800,
                fontSize: ".82rem",
              }}
            >
              Found Portal
            </button>

            <Link
              to="/lost-reports"
              className="uf-tab"
              style={{
                textDecoration: "none",
                color: "var(--uf-ink-soft)",
                borderRadius: "999px",
                padding: ".62rem 1.2rem",
                fontWeight: 800,
                fontSize: ".82rem",
              }}
            >
              My Reports
            </Link>
          </nav>

          <div style={{ display: "flex", gap: ".7rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link
              to="/report-lost"
              className="uf-btn"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                background: "linear-gradient(135deg,var(--uf-amber),var(--uf-gold))",
                color: "white",
                borderRadius: "999px",
                padding: ".78rem 1.25rem",
                fontWeight: 800,
                fontSize: ".82rem",
                boxShadow: "0 16px 26px rgba(216,139,18,0.24)",
              }}
            >
              <Icon.Plus />
              Report Lost
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1380, margin: "0 auto", padding: "2rem 1.3rem 3rem", position: "relative", zIndex: 1 }}>
        <section
          className="uf-soft-panel uf-animate"
          style={{
            overflow: "hidden",
            padding: "2.3rem",
            position: "relative",
            marginBottom: "2rem",
          }}
        >
          <div style={{ position: "absolute", width: 260, height: 260, top: -50, right: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(216,139,18,0.10) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", width: 220, height: 220, bottom: -40, left: -50, borderRadius: "50%", background: "radial-gradient(circle, rgba(229,108,24,0.08) 0%, transparent 70%)" }} />

          <div className="uf-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: "2.4rem", alignItems: "center", position: "relative" }}>
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <SoftBadge tone="gold">
                  <Icon.Sparkle />
                  Lost Portal Showcase
                </SoftBadge>
              </div>

              <h1
                style={{
                  fontFamily: "var(--uf-display)",
                  fontSize: "clamp(2.3rem, 5vw, 4.3rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-.04em",
                  color: "var(--uf-ink)",
                  maxWidth: 780,
                }}
              >
                Recover lost belongings through a cleaner, smarter,
                <span style={{ color: "var(--uf-amber)", fontStyle: "italic" }}> student-friendly </span>
                experience.
              </h1>

              <p
                style={{
                  marginTop: "1rem",
                  maxWidth: 760,
                  color: "var(--uf-ink-soft)",
                  lineHeight: 1.85,
                  fontSize: "1rem",
                }}
              >
                This upgraded page turns your lost portal into a more complete product. It includes advanced filtering, saved searches, compare mode, visual dashboards, quick insights, bookmarks, favorites, export, and a detailed side drawer for each item.
              </p>

              <div className="uf-hero-actions" style={{ display: "flex", gap: ".8rem", flexWrap: "wrap", marginTop: "1.4rem" }}>
                <Link
                  to="/report-lost"
                  className="uf-btn"
                  style={{
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".6rem",
                    background: "linear-gradient(135deg,var(--uf-amber),var(--uf-gold))",
                    color: "white",
                    padding: ".9rem 1.5rem",
                    borderRadius: "999px",
                    fontWeight: 800,
                    boxShadow: "0 14px 30px rgba(216,139,18,0.22)",
                  }}
                >
                  <Icon.Plus />
                  Report lost item
                </Link>

                <button
                  type="button"
                  onClick={() => setShowSavedModal(true)}
                  className="uf-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".6rem",
                    background: "white",
                    color: "var(--uf-gold)",
                    padding: ".9rem 1.4rem",
                    borderRadius: "999px",
                    border: "1px solid var(--uf-line)",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  <Icon.Bookmark />
                  Save current search
                </button>
              </div>

              <div className="uf-stats-row" style={{ display: "flex", gap: "1rem", marginTop: "1.6rem", flexWrap: "wrap" }}>
                <StatTile icon="📋" value={totalReports} label="Total reports" helper="All reports available on this page." />
                <StatTile icon="🔓" value={openReports} label="Open reports" helper="Items still waiting for recovery." />
                <StatTile icon="🧠" value={matchReports} label="Possible matches" helper="Reports with stronger overlap clues." />
                <StatTile icon="✅" value={returnedReports} label="Returned items" helper="Reports already completed." />
              </div>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div className="uf-soft-panel" style={{ padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: ".7rem", alignItems: "center", marginBottom: ".7rem" }}>
                  <div style={{ fontWeight: 800, color: "var(--uf-ink)" }}>Portal summary</div>
                  <SoftBadge tone="green">Live data</SoftBadge>
                </div>

                <div style={{ display: "grid", gap: ".7rem" }}>
                  <NotificationCard title="Lost portal focus" text="This page is focused on reporting, browsing, and tracking lost items without mixing in extra Found Portal content." />
                  <NotificationCard title="Current filters" tone="neutral" text={activeFilterCount ? `${activeFilterCount} active filter${activeFilterCount > 1 ? "s" : ""} applied to this view.` : "No extra filters applied. You are seeing the full lost-item list."} time={activeFilterCount ? "Filtered view" : "Full list"} />
                  <NotificationCard title="Saved progress" tone="green" text={`${savedSearches.length} saved search setup${savedSearches.length === 1 ? "" : "s"}, ${bookmarkedCount} bookmark${bookmarkedCount === 1 ? "" : "s"}, and ${favoriteCount} favorite${favoriteCount === 1 ? "" : "s"}.`} time="Quick summary" />
                </div>
              </div>

              <div className="uf-grid-2">
                {quickSummaryCards.map((stat) => (
                  <div
                    key={stat.id}
                    className="uf-card"
                    style={{
                      background: "white",
                      border: "1px solid var(--uf-line-soft)",
                      borderRadius: "var(--uf-r-md)",
                      padding: "1rem",
                      boxShadow: "var(--uf-shadow-sm)",
                    }}
                  >
                    <div style={{ fontSize: "1.4rem", marginBottom: ".5rem" }}>{stat.icon}</div>
                    <div style={{ fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--uf-ink-fade)", fontWeight: 800 }}>
                      {stat.label}
                    </div>
                    <div style={{ marginTop: ".35rem", fontWeight: 800, color: "var(--uf-ink)", fontSize: ".95rem" }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {(serverNotice || error) && (
          <section style={{ marginBottom: "1.4rem", display: "grid", gap: ".8rem" }}>
            {serverNotice && <NotificationCard title="Preview notice" text={serverNotice} tone="gold" time="Fallback" />}
            {error && <NotificationCard title="Connection notice" text={error} tone="neutral" time="Offline mode" />}
          </section>
        )}

        <section style={{ marginBottom: "2rem" }}>
          <SectionHeading
            badge="Dashboard"
            title="Lost portal status overview"
            subtitle="These four numbers show the real report flow at a glance and keep the dashboard useful instead of decorative."
          />
          <div className="uf-grid-4">
            {dashboardHighlights.map((entry) => (
              <MetricCard key={entry.title} {...entry} />
            ))}
          </div>
        </section>

        <ComparePanel
          selectedItems={compareIds}
          allItems={items}
          onRemove={(id) => setCompareIds((prev) => prev.filter((value) => value !== id))}
          onClear={() => setCompareIds([])}
        />

        <section className="uf-browse-grid" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "1.4rem", alignItems: "start", marginBottom: "2rem" }}>
          <aside style={{ display: "grid", gap: "1rem", position: "sticky", top: 92 }}>
            <div className="uf-soft-panel" style={{ padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: ".7rem", marginBottom: ".8rem" }}>
                <div>
                  <div style={{ fontWeight: 800, color: "var(--uf-ink)" }}>Search & filters</div>
                  <div style={{ fontSize: ".8rem", color: "var(--uf-ink-soft)", marginTop: ".25rem" }}>
                    Fine-tune your browse view.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  className="uf-btn"
                  style={{
                    border: "1px solid var(--uf-line)",
                    background: "white",
                    color: "var(--uf-gold)",
                    borderRadius: "999px",
                    padding: ".58rem .9rem",
                    fontWeight: 800,
                    fontSize: ".75rem",
                    cursor: "pointer",
                  }}
                >
                  {showAdvanced ? "Hide advanced" : "Show advanced"}
                </button>
              </div>

              <div className="uf-filter-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: ".9rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: ".38rem", fontSize: ".7rem", fontWeight: 800, color: "var(--uf-ink-fade)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                    Search keyword
                  </label>
                  <div className="uf-input-shell" style={{ display: "flex", alignItems: "center", gap: ".55rem", background: "white", border: "1px solid var(--uf-line)", borderRadius: "999px", padding: ".85rem 1rem" }}>
                    <span style={{ color: "var(--uf-ink-fade)", display: "flex" }}><Icon.Search /></span>
                    <input
                      ref={searchInputRef}
                      value={keyword}
                      onChange={(event) => setKeyword(event.target.value)}
                      placeholder="Title, location, brand, clue..."
                      style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: ".88rem", color: "var(--uf-ink)" }}
                    />
                  </div>
                </div>

                <div className="uf-grid-2">
                  <div>
                    <label style={{ display: "block", marginBottom: ".38rem", fontSize: ".7rem", fontWeight: 800, color: "var(--uf-ink-fade)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                      Category
                    </label>
                    <div className="uf-input-shell" style={{ background: "white", border: "1px solid var(--uf-line)", borderRadius: "999px", padding: ".82rem 1rem" }}>
                      <select value={category} onChange={(event) => setCategory(event.target.value)} style={{ width: "100%", border: "none", outline: "none", background: "transparent", color: "var(--uf-ink)", fontSize: ".86rem" }}>
                        {categories.map((entry) => (
                          <option key={entry} value={entry}>{entry}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: ".38rem", fontSize: ".7rem", fontWeight: 800, color: "var(--uf-ink-fade)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                      Status
                    </label>
                    <div className="uf-input-shell" style={{ background: "white", border: "1px solid var(--uf-line)", borderRadius: "999px", padding: ".82rem 1rem" }}>
                      <select value={status} onChange={(event) => setStatus(event.target.value)} style={{ width: "100%", border: "none", outline: "none", background: "transparent", color: "var(--uf-ink)", fontSize: ".86rem" }}>
                        {statuses.map((entry) => (
                          <option key={entry} value={entry}>
                            {entry === "All" ? "All statuses" : STATUS_META[entry]?.label || entry}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: ".38rem", fontSize: ".7rem", fontWeight: 800, color: "var(--uf-ink-fade)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                    Sort order
                  </label>
                  <div className="uf-input-shell" style={{ background: "white", border: "1px solid var(--uf-line)", borderRadius: "999px", padding: ".82rem 1rem" }}>
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} style={{ width: "100%", border: "none", outline: "none", background: "transparent", color: "var(--uf-ink)", fontSize: ".86rem" }}>
                      <option value="date_desc">Newest first</option>
                      <option value="date_asc">Oldest first</option>
                      <option value="title_asc">Title A → Z</option>
                      <option value="title_desc">Title Z → A</option>
                      <option value="views_desc">Most viewed</option>
                      <option value="claims_desc">Most claims</option>
                      <option value="match_desc">Highest match score</option>
                    </select>
                  </div>
                </div>

                {showAdvanced && (
                  <>
                    <div>
                      <label style={{ display: "block", marginBottom: ".38rem", fontSize: ".7rem", fontWeight: 800, color: "var(--uf-ink-fade)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                        Quick date range
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                        {[
                          { value: "all", label: "All time" },
                          { value: "today", label: "Today" },
                          { value: "7", label: "7 days" },
                          { value: "14", label: "14 days" },
                          { value: "30", label: "30 days" },
                          { value: "60", label: "60 days" },
                        ].map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => applyPresetDateRange(preset.value)}
                            className="uf-btn"
                            style={{
                              borderRadius: "999px",
                              border: quickRange === preset.value ? "none" : "1px solid var(--uf-line)",
                              background: quickRange === preset.value ? "linear-gradient(135deg,var(--uf-amber),var(--uf-gold))" : "white",
                              color: quickRange === preset.value ? "white" : "var(--uf-ink-soft)",
                              padding: ".58rem .85rem",
                              fontWeight: 800,
                              fontSize: ".75rem",
                              cursor: "pointer",
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="uf-grid-2">
                      <div>
                        <label style={{ display: "block", marginBottom: ".38rem", fontSize: ".7rem", fontWeight: 800, color: "var(--uf-ink-fade)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                          Date from
                        </label>
                        <div className="uf-input-shell" style={{ background: "white", border: "1px solid var(--uf-line)", borderRadius: "999px", padding: ".82rem 1rem" }}>
                          <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} style={{ width: "100%", border: "none", outline: "none", background: "transparent", color: "var(--uf-ink)", fontSize: ".86rem" }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", marginBottom: ".38rem", fontSize: ".7rem", fontWeight: 800, color: "var(--uf-ink-fade)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                          Date to
                        </label>
                        <div className="uf-input-shell" style={{ background: "white", border: "1px solid var(--uf-line)", borderRadius: "999px", padding: ".82rem 1rem" }}>
                          <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} style={{ width: "100%", border: "none", outline: "none", background: "transparent", color: "var(--uf-ink)", fontSize: ".86rem" }} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="uf-btn"
                    style={{
                      flex: 1,
                      borderRadius: "999px",
                      background: "white",
                      color: "var(--uf-ink-soft)",
                      border: "1px solid var(--uf-line)",
                      padding: ".82rem 1rem",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Clear filters
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSavedModal(true)}
                    className="uf-btn"
                    style={{
                      flex: 1,
                      borderRadius: "999px",
                      background: "rgba(216,139,18,0.08)",
                      color: "var(--uf-gold)",
                      border: "1px solid rgba(216,139,18,0.14)",
                      padding: ".82rem 1rem",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Save setup
                  </button>
                </div>
              </div>
            </div>

            <div className="uf-soft-panel" style={{ padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: ".7rem", alignItems: "center", marginBottom: ".8rem" }}>
                <div>
                  <div style={{ fontWeight: 800, color: "var(--uf-ink)" }}>Saved searches</div>
                  <div style={{ fontSize: ".8rem", color: "var(--uf-ink-soft)", marginTop: ".25rem" }}>
                    Reuse search setups quickly.
                  </div>
                </div>

                <SoftBadge tone="neutral">{savedSearches.length}</SoftBadge>
              </div>

              <div style={{ display: "grid", gap: ".8rem" }}>
                {savedSearches.slice(0, 4).map((entry) => (
                  <SavedSearchCard key={entry.id} search={entry} onApply={handleApplySavedSearch} onRemove={handleRemoveSavedSearch} />
                ))}
              </div>
            </div>

            <div className="uf-soft-panel" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 800, color: "var(--uf-ink)", marginBottom: ".85rem" }}>Status guide</div>
              <div style={{ display: "grid", gap: ".75rem" }}>
                {STATUS_GUIDE.map((step) => (
                  <div key={step.id} style={{ display: "grid", gridTemplateColumns: "12px 1fr", gap: ".8rem", alignItems: "start" }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        marginTop: ".35rem",
                        background:
                          step.tone === "green"
                            ? "var(--uf-green)"
                            : step.tone === "gold"
                              ? "var(--uf-gold)"
                              : "var(--uf-ink-fade)",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: "var(--uf-ink)", fontSize: ".86rem" }}>{step.title}</div>
                      <div style={{ marginTop: ".3rem", fontSize: ".8rem", color: "var(--uf-ink-soft)", lineHeight: 1.6 }}>{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--uf-line-soft)" }}>
                <div style={{ fontWeight: 800, color: "var(--uf-ink)", fontSize: ".86rem", marginBottom: ".45rem" }}>Browse summary</div>
                <div style={{ fontSize: ".8rem", color: "var(--uf-ink-soft)", lineHeight: 1.65 }}>
                  {filteredItems.length} item{filteredItems.length === 1 ? "" : "s"} match the current filters across {categoryCount} categor{categoryCount === 1 ? "y" : "ies"}. Use the detail drawer to review clues before contacting the owner.
                </div>
              </div>
            </div>
          </aside>

          <section style={{ display: "grid", gap: "1rem" }}>
            <div className="uf-soft-panel" style={{ padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800, color: "var(--uf-ink)", fontSize: "1rem" }}>Browse lost reports</div>
                  <div style={{ marginTop: ".3rem", color: "var(--uf-ink-soft)", fontSize: ".84rem" }}>
                    {filteredItems.length} result(s) • {activeFilterCount} active filter(s)
                  </div>
                </div>

                <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setViewMode("comfortable")}
                    className="uf-btn"
                    style={{
                      borderRadius: "999px",
                      border: viewMode === "comfortable" ? "none" : "1px solid var(--uf-line)",
                      background: viewMode === "comfortable" ? "linear-gradient(135deg,var(--uf-amber),var(--uf-gold))" : "white",
                      color: viewMode === "comfortable" ? "white" : "var(--uf-ink-soft)",
                      padding: ".7rem 1rem",
                      fontWeight: 800,
                      fontSize: ".78rem",
                      cursor: "pointer",
                    }}
                  >
                    Comfortable
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("compact")}
                    className="uf-btn"
                    style={{
                      borderRadius: "999px",
                      border: viewMode === "compact" ? "none" : "1px solid var(--uf-line)",
                      background: viewMode === "compact" ? "linear-gradient(135deg,var(--uf-amber),var(--uf-gold))" : "white",
                      color: viewMode === "compact" ? "white" : "var(--uf-ink-soft)",
                      padding: ".7rem 1rem",
                      fontWeight: 800,
                      fontSize: ".78rem",
                      cursor: "pointer",
                    }}
                  >
                    Compact
                  </button>
                </div>
              </div>

              {(keyword || category !== "All" || status !== "All" || dateFrom || dateTo || sortBy !== "date_desc") && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: "1rem" }}>
                  {keyword && <SoftBadge tone="neutral">Keyword: {keyword}</SoftBadge>}
                  {category !== "All" && <SoftBadge tone="neutral">Category: {category}</SoftBadge>}
                  {status !== "All" && <SoftBadge tone="neutral">Status: {STATUS_META[status]?.label || status}</SoftBadge>}
                  {dateFrom && <SoftBadge tone="neutral">From: {dateFrom}</SoftBadge>}
                  {dateTo && <SoftBadge tone="neutral">To: {dateTo}</SoftBadge>}
                  {sortBy !== "date_desc" && <SoftBadge tone="neutral">Sort: {sortBy}</SoftBadge>}
                </div>
              )}
            </div>

            <div className="uf-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.2rem" }}>
              {paginatedItems.length === 0 ? (
                <EmptyState onClear={clearFilters} />
              ) : (
                paginatedItems.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    viewMode={viewMode}
                    onView={(entry) => setSelectedItemId(entry._id)}
                    onEdit={(entry) => navigate(`/lost-reports/edit/${entry._id}`)}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleBookmark={handleToggleBookmark}
                    onCompare={handleAddCompare}
                    isFavorite={favorites.includes(item._id)}
                    isBookmarked={bookmarks.includes(item._id)}
                  />
                ))
              )}
            </div>

            {filteredItems.length > 0 && (
              <div className="uf-soft-panel" style={{ padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: ".8rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="uf-btn"
                    style={{
                      borderRadius: "999px",
                      border: "1px solid var(--uf-line)",
                      background: "white",
                      color: "var(--uf-ink-soft)",
                      padding: ".75rem 1rem",
                      fontWeight: 800,
                      fontSize: ".8rem",
                      cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                      opacity: currentPage <= 1 ? .45 : 1,
                    }}
                  >
                    <Icon.ArrowLeft /> Prev
                  </button>

                  <div style={{ display: "flex", gap: ".45rem", flexWrap: "wrap", justifyContent: "center" }}>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className="uf-btn"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "999px",
                          border: currentPage === page ? "none" : "1px solid var(--uf-line)",
                          background: currentPage === page ? "linear-gradient(135deg,var(--uf-amber),var(--uf-gold))" : "white",
                          color: currentPage === page ? "white" : "var(--uf-ink-soft)",
                          fontWeight: 800,
                          fontSize: ".82rem",
                          cursor: "pointer",
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="uf-btn"
                    style={{
                      borderRadius: "999px",
                      border: "1px solid var(--uf-line)",
                      background: "white",
                      color: "var(--uf-ink-soft)",
                      padding: ".75rem 1rem",
                      fontWeight: 800,
                      fontSize: ".8rem",
                      cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                      opacity: currentPage >= totalPages ? .45 : 1,
                    }}
                  >
                    Next <Icon.ArrowRight />
                  </button>
                </div>
              </div>
            )}
          </section>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <SectionHeading
            badge="How It Works"
            title="Simple recovery process for students"
            subtitle="A clearer workflow explanation adds depth to the module and makes it easier for users and lecturers to understand the intent."
          />

          <div className="uf-grid-4">
            {[
              { id: "p1", icon: "📝", title: "Report clearly", text: "Create a proper report using exact location, date, item title, and marks such as stickers, scratches, or accessories." },
              { id: "p2", icon: "🔎", title: "Search smart", text: "Use categories, keyword search, date filters, and status filters to narrow results and find possible matches faster." },
              { id: "p3", icon: "📬", title: "Verify ownership", text: "Extra details like brands, bag contents, serial clues, and color help reduce false claims and improve trust." },
              { id: "p4", icon: "🤝", title: "Close the case", text: "Once the owner receives the item back, the report can be marked returned so the history stays clean and organized." },
            ].map((step) => (
              <div
                key={step.id}
                className="uf-card"
                style={{
                  background: "white",
                  border: "1px solid var(--uf-line-soft)",
                  borderRadius: "var(--uf-r-lg)",
                  padding: "1.4rem",
                  boxShadow: "var(--uf-shadow-sm)",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>{step.icon}</div>
                <div style={{ fontWeight: 800, color: "var(--uf-ink)", fontSize: "1rem" }}>{step.title}</div>
                <div style={{ marginTop: ".5rem", color: "var(--uf-ink-soft)", fontSize: ".86rem", lineHeight: 1.7 }}>{step.text}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <SectionHeading
            badge="Testimonials"
            title="What students say about the portal"
            subtitle="Social proof makes the page more complete and visually balanced."
          />
          <div className="uf-grid-4">
            {TESTIMONIALS.map((entry) => (
              <div
                key={entry.name}
                className="uf-card"
                style={{
                  background: "white",
                  border: "1px solid var(--uf-line-soft)",
                  borderRadius: "var(--uf-r-lg)",
                  padding: "1.3rem",
                  boxShadow: "var(--uf-shadow-sm)",
                }}
              >
                <div style={{ fontSize: "1.1rem", marginBottom: ".5rem" }}>{entry.stars}</div>
                <div style={{ color: "var(--uf-ink-soft)", fontSize: ".86rem", lineHeight: 1.75, fontStyle: "italic" }}>
                  “{entry.text}”
                </div>
                <div style={{ marginTop: "1rem", fontWeight: 800, color: "var(--uf-gold)", fontSize: ".9rem" }}>{entry.name}</div>
                <div style={{ marginTop: ".2rem", color: "var(--uf-ink-fade)", fontSize: ".76rem" }}>{entry.role}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <SectionHeading
            badge="FAQ"
            title="Common questions"
            subtitle="These help your page look realistic and explain the practical flow around reporting, searching, and returning."
          />
          <div className="uf-grid-2">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="uf-card"
                style={{
                  background: "white",
                  border: "1px solid var(--uf-line-soft)",
                  borderRadius: "var(--uf-r-lg)",
                  padding: "1.3rem",
                  boxShadow: "var(--uf-shadow-sm)",
                }}
              >
                <div style={{ fontWeight: 800, color: "var(--uf-ink)", fontSize: ".95rem" }}>{faq.q}</div>
                <div style={{ marginTop: ".55rem", color: "var(--uf-ink-soft)", fontSize: ".86rem", lineHeight: 1.75 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "linear-gradient(135deg, var(--uf-ink) 0%, #463120 100%)",
            borderRadius: "var(--uf-r-xl)",
            padding: "2.7rem 2rem",
            boxShadow: "var(--uf-shadow-xl)",
            position: "relative",
            overflow: "hidden",
            marginBottom: "2rem",
          }}
        >
          <div style={{ position: "absolute", top: -70, right: -40, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(216,139,18,0.18) 0%, transparent 72%)" }} />
          <div style={{ position: "absolute", bottom: -50, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(229,108,24,0.16) 0%, transparent 72%)" }} />

          <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: ".6rem" }}>🔍</div>
            <div style={{ fontFamily: "var(--uf-display)", fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: "-.03em", color: "white", fontWeight: 800 }}>
              Lost something important?
            </div>
            <p style={{ marginTop: ".8rem", color: "rgba(255,255,255,0.72)", maxWidth: 700, marginInline: "auto", lineHeight: 1.8, fontSize: ".98rem" }}>
              Report it now with clear details and let the campus community help you recover it faster. Strong descriptions and accurate location details make the biggest difference.
            </p>

            <div style={{ display: "flex", gap: ".8rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.3rem" }}>
              <Link
                to="/report-lost"
                className="uf-btn"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".6rem",
                  background: "linear-gradient(135deg, var(--uf-amber), var(--uf-gold))",
                  color: "white",
                  padding: ".95rem 1.5rem",
                  borderRadius: "999px",
                  fontWeight: 800,
                  boxShadow: "0 14px 32px rgba(216,139,18,0.28)",
                }}
              >
                <Icon.Plus />
                Create lost report
              </Link>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="uf-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".6rem",
                  background: "rgba(255,255,255,0.10)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.16)",
                  padding: ".95rem 1.5rem",
                  borderRadius: "999px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                <Icon.ArrowLeft />
                Back to top
              </button>
            </div>
          </div>
        </section>

        <footer style={{ paddingTop: ".5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.4rem", marginBottom: "1.5rem" }}>
            <div>
              <div style={{ fontFamily: "var(--uf-display)", fontSize: "1.65rem", fontWeight: 800, letterSpacing: "-.03em", background: "linear-gradient(135deg,var(--uf-ink),var(--uf-gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                UniFind
              </div>
              <div style={{ marginTop: ".5rem", color: "var(--uf-ink-soft)", lineHeight: 1.7, fontSize: ".86rem" }}>
                A cleaner and more user-friendly university lost & found experience for students, staff, and campus communities.
              </div>
            </div>

            <div style={{ display: "grid", gap: ".55rem" }}>
              <div style={{ fontSize: ".75rem", fontWeight: 800, color: "var(--uf-ink-fade)", letterSpacing: ".08em", textTransform: "uppercase" }}>Quick links</div>
              <Link to="/report-lost" style={{ color: "var(--uf-ink-soft)", textDecoration: "none", fontSize: ".86rem" }}>Report lost item</Link>
              <Link to="/lost-reports" style={{ color: "var(--uf-ink-soft)", textDecoration: "none", fontSize: ".86rem" }}>Manage reports</Link>
              <button type="button" onClick={handleFoundPortalClick} style={{ background: "none", border: "none", textAlign: "left", color: "var(--uf-ink-soft)", cursor: "pointer", padding: 0, fontSize: ".86rem" }}>Found portal</button>
            </div>

            <div style={{ display: "grid", gap: ".55rem" }}>
              <div style={{ fontSize: ".75rem", fontWeight: 800, color: "var(--uf-ink-fade)", letterSpacing: ".08em", textTransform: "uppercase" }}>User help</div>
              <a href="#!" style={{ color: "var(--uf-ink-soft)", textDecoration: "none", fontSize: ".86rem" }}>How it works</a>
              <a href="#!" style={{ color: "var(--uf-ink-soft)", textDecoration: "none", fontSize: ".86rem" }}>FAQ</a>
              <a href="#!" style={{ color: "var(--uf-ink-soft)", textDecoration: "none", fontSize: ".86rem" }}>Support</a>
            </div>

            <div style={{ display: "grid", gap: ".55rem" }}>
              <div style={{ fontSize: ".75rem", fontWeight: 800, color: "var(--uf-ink-fade)", letterSpacing: ".08em", textTransform: "uppercase" }}>Policy</div>
              <a href="#!" style={{ color: "var(--uf-ink-soft)", textDecoration: "none", fontSize: ".86rem" }}>Privacy policy</a>
              <a href="#!" style={{ color: "var(--uf-ink-soft)", textDecoration: "none", fontSize: ".86rem" }}>Terms of use</a>
              <a href="#!" style={{ color: "var(--uf-ink-soft)", textDecoration: "none", fontSize: ".86rem" }}>Claim guidelines</a>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--uf-line-soft)", paddingTop: "1rem", color: "var(--uf-ink-fade)", fontSize: ".78rem", textAlign: "center" }}>
            © 2026 UniFind • Lost Portal module preview
          </div>
        </footer>
      </main>

      <DetailsDrawer
        item={selectedItem}
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItemId(null)}
        onToggleFavorite={handleToggleFavorite}
        onToggleBookmark={handleToggleBookmark}
        isFavorite={selectedItem ? favorites.includes(selectedItem._id) : false}
        isBookmarked={selectedItem ? bookmarks.includes(selectedItem._id) : false}
      />

      <CreateSavedSearchModal
        open={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        onSave={handleSaveSearch}
        searchState={searchState}
      />
    </div>
  );
}

export default HomeBrowsePage;
