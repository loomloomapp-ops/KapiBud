// Набір SVG-іконок з default width/height. Без default розмірів SVG падає до
// 300×150 і вилазить з контейнерів (case zoom, slider arrows тощо).
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

export const IconHex = (p: P) => (
  <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M19.8586 36.0067C19.7964 36.0067 19.7342 35.9915 19.6778 35.9612L5.56106 28.3864C5.43689 28.3198 5.35938 28.1903 5.35938 28.0493V12.2111C5.35938 12.0701 5.43689 11.9406 5.56106 11.874L19.6778 4.29917C19.7907 4.23857 19.9265 4.23857 20.0396 4.29917L34.1562 11.874C34.2804 11.9406 34.3579 12.0701 34.3579 12.2111V28.0493C34.3579 28.1903 34.2804 28.3198 34.1562 28.3864L20.0396 35.9612C19.983 35.9915 19.9208 36.0067 19.8586 36.0067ZM6.12451 27.8205L19.8586 35.1899L33.5927 27.8205V26.2786L20.0395 33.5512C19.9264 33.6116 19.7907 33.6116 19.6776 33.5512L6.12451 26.2785V27.8205ZM6.12451 25.4103L19.8586 32.7797L33.5927 25.4103V24.835L32.0502 24.0074L20.0395 30.4523C19.9264 30.5129 19.7907 30.5128 19.6776 30.4522L7.66707 24.0074L6.12451 24.835V25.4103ZM8.47624 23.5732L19.8586 29.681L31.2411 23.5732L29.163 22.4582L20.0396 27.3535C19.9265 27.414 19.7907 27.4141 19.6778 27.3534L10.5546 22.4579L8.47624 23.5732ZM11.3638 22.0238L19.8586 26.5821L28.3538 22.024L26.2756 20.9089L20.0395 24.2547C19.9264 24.3153 19.7907 24.3152 19.6776 24.2547L13.4419 20.9086L11.3638 22.0238ZM33.5927 23.9668V21.7363L19.8586 14.3668L6.12451 21.7363V23.9667L19.6778 16.6943C19.7907 16.6337 19.9265 16.6337 20.0396 16.6943L33.5927 23.9668ZM14.2511 20.4745L19.8586 23.4834L25.4664 20.4747L19.8586 17.4656L14.2511 20.4745ZM19.8586 13.5501C19.9208 13.5501 19.983 13.5652 20.0395 13.5955L33.5927 20.868V18.6376L19.8586 11.268L6.12451 18.6375V20.8679L19.6778 13.5955C19.7342 13.5652 19.7964 13.5501 19.8586 13.5501ZM19.8586 10.4513C19.9208 10.4513 19.983 10.4664 20.0395 10.4968L33.5927 17.7692V15.5388L19.8586 8.16923L6.12451 15.5388V17.7692L19.6778 10.4968C19.7342 10.4664 19.7964 10.4513 19.8586 10.4513ZM19.8586 7.35248C19.9208 7.35248 19.983 7.36765 20.0395 7.39792L33.5927 14.6705V12.44L19.8586 5.07042L6.12451 12.4399V14.6703L19.6778 7.39792C19.7342 7.36765 19.7964 7.35248 19.8586 7.35248Z" fill="currentColor" />
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
export const IconApartment = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}>
    <rect x="4" y="3" width="14" height="16" rx="1" />
    <path d="M7 6h2M13 6h2M7 10h2M13 10h2M7 14h2M13 14h2" />
    <path d="M9 19v-2h4v2" />
  </svg>
);
export const IconShop = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}>
    <path d="M4 8l1-3h12l1 3" />
    <path d="M4 8v10h14V8" />
    <path d="M4 8c0 1.5 1 2.5 2.5 2.5S9 9.5 9 8c0 1.5 1 2.5 2.5 2.5S14 9.5 14 8c0 1.5 1 2.5 2.5 2.5S19 9.5 19 8" />
    <path d="M9 18v-5h4v5" />
  </svg>
);
export const IconBlueprint = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}>
    <path d="M6 3h8l4 4v12H6z" />
    <path d="M14 3v4h4" />
    <path d="M9 11h6M9 14h6M9 17h4" />
  </svg>
);
export const IconQuestion = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="M8.5 8.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
    <circle cx="11" cy="15.5" r=".6" fill="currentColor" stroke="none" />
  </svg>
);
export const IconPalette = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}>
    <path d="M11 3a8 8 0 0 0 0 16c1.2 0 1.5-.9 1.5-1.7 0-.5-.4-.9-.4-1.4 0-.8.6-1.4 1.4-1.4H15a4 4 0 0 0 4-4c0-4-3.6-7.5-8-7.5z" />
    <circle cx="6.5" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="6.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="13" cy="6.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="10" r="1" fill="currentColor" stroke="none" />
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
