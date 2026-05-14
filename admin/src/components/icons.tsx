// Маленькі inline SVG-іконки (стиль Lucide). 18px стандарт, currentColor.
const C = ({ children, size = 18 }: { children: any; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

export const IcLayers = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></C>;
export const IcFolderOpen = ({ size = 18 }: { size?: number }) => <C size={size}><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></C>;
export const IcMessageSquare = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></C>;
export const IcTag = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></C>;
export const IcHelp = ({ size = 18 }: { size?: number }) => <C size={size}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></C>;
export const IcUsers = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></C>;
export const IcPlus = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M5 12h14"/><path d="M12 5v14"/></C>;
export const IcTrash = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></C>;
export const IcEdit = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></C>;
export const IcSave = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></C>;
export const IcGrip = ({ size = 18 }: { size?: number }) => <C size={size}><circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/></C>;
export const IcLogout = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></C>;
export const IcUpload = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></C>;
export const IcImage = ({ size = 18 }: { size?: number }) => <C size={size}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></C>;
export const IcArrowLeft = ({ size = 18 }: { size?: number }) => <C size={size}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></C>;
export const IcCheck = ({ size = 18 }: { size?: number }) => <C size={size}><polyline points="20 6 9 17 4 12"/></C>;
export const IcMessageCircle = ({ size = 18 }: { size?: number }) => <C size={size}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></C>;
