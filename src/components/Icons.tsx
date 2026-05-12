// Набір SVG-іконок з default width/height. Без default розмірів SVG падає до
// 300×150 і вилазить з контейнерів (case zoom, slider arrows тощо).
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

export const IconHex = (p: P) => (
  <svg width={32} height={32} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" {...p}>
    <polygon points="16,4 27,10 27,22 16,28 5,22 5,10" />
    <polygon points="16,9 23,12.5 23,19.5 16,23 9,19.5 9,12.5" />
    <polygon points="16,13 20,15 20,19 16,21 12,19 12,15" />
  </svg>
);

export const IconPhone = (p: P) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 3h3l1.5 4-2 1.5a10 10 0 0 0 4.5 4.5L13.5 11l4 1.5V15a2 2 0 0 1-2 2A12 12 0 0 1 3 5a2 2 0 0 1 2-2z" />
  </svg>
);

export const IconUser = (p: P) => (
  <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <circle cx="9" cy="6" r="3" />
    <path d="M3 16c0-3.5 2.7-5 6-5s6 1.5 6 5" />
  </svg>
);

export const IconCallSmall = (p: P) => (
  <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="M4 3h2.5L8 6.5 6.5 8a9 9 0 0 0 3.5 3.5L11.5 10 15 11.5V14a1.5 1.5 0 0 1-1.5 1.5A11 11 0 0 1 2.5 4.5 1.5 1.5 0 0 1 4 3z" />
  </svg>
);

export const IconZoom = (p: P) => (
  <svg width={16} height={16} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
    <circle cx="8" cy="8" r="5" />
    <path d="M8 5v6M5 8h6M12 12l3 3" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg width={20} height={20} viewBox="0 0 22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" {...p}>
    <path d="M5 5l12 12M17 5L5 17" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg width={12} height={16} viewBox="0 0 10 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="3,2 7,7 3,12" />
  </svg>
);

export const IconChevronLeft = (p: P) => (
  <svg width={12} height={16} viewBox="0 0 10 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="7,2 3,7 7,12" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="M8 14s5-4.5 5-8.5A5 5 0 0 0 3 5.5C3 9.5 8 14 8 14z" />
    <circle cx="8" cy="6" r="2" />
  </svg>
);

export const IconTikTok = (p: P) => (
  <svg width={18} height={18} viewBox="0 0 20 20" fill="currentColor" {...p}>
    <path d="M14 2c.7 1.5 2 2.7 3.5 3.2v2.4c-1.4-.1-2.6-.5-3.7-1.2v5.6c0 3.3-2.7 6-6 6S2 15.3 2 12s2.7-6 6-6c.3 0 .7 0 1 .1v2.5c-.3-.1-.7-.2-1-.2-2 0-3.6 1.6-3.6 3.6S6 15.6 8 15.6s3.6-1.6 3.6-3.6V2z" />
  </svg>
);
export const IconInstagram = (p: P) => (
  <svg width={18} height={18} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <rect x="3" y="3" width="14" height="14" rx="4" />
    <circle cx="10" cy="10" r="3.5" />
    <circle cx="14.5" cy="5.5" r=".8" fill="currentColor" stroke="none" />
  </svg>
);
export const IconFacebook = (p: P) => (
  <svg width={18} height={18} viewBox="0 0 20 20" fill="currentColor" {...p}>
    <path d="M11 18v-7h2.3l.4-3H11V6c0-.8.3-1.5 1.5-1.5h1.4V2h-2.4C9.3 2 8 3.3 8 5.4V8H6v3h2v7z" />
  </svg>
);

export const IconHome = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M3 11l8-7 8 7" />
    <path d="M5 10v8h12v-8" />
  </svg>
);
export const IconLayout = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <rect x="4" y="6" width="14" height="11" rx="1" />
    <path d="M4 9h14M8 4v4M14 4v4" />
  </svg>
);
export const IconEdit = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M15 4l3 3-9 9-4 1 1-4z" />
  </svg>
);
export const IconChat = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <circle cx="11" cy="11" r="7" />
    <circle cx="8" cy="9" r="1" fill="currentColor" />
    <circle cx="14" cy="9" r="1" fill="currentColor" />
    <circle cx="8" cy="13" r="1" fill="currentColor" />
    <circle cx="14" cy="13" r="1" fill="currentColor" />
  </svg>
);
