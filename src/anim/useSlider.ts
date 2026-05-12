import { useCallback, useRef, useState } from 'react';

export function useSlider(totalPages: number) {
  const [page, setPageRaw] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startPage = useRef(0);
  const wasDragged = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const setPage = useCallback(
    (next: number | ((p: number) => number)) => {
      setPageRaw((p) => {
        const n = typeof next === 'function' ? (next as (p: number) => number)(p) : next;
        return Math.max(0, Math.min(totalPages - 1, n));
      });
    },
    [totalPages]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    startPage.current = page;
    wasDragged.current = false;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    // ignore drags that are clearly vertical (let page scroll)
    if (!wasDragged.current && Math.abs(dy) > Math.abs(dx) * 1.2 && Math.abs(dy) > 8) {
      setDragging(false);
      return;
    }
    if (Math.abs(dx) > 6) {
      wasDragged.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }
    setDragX(dx);
  };

  const finish = (e: React.PointerEvent) => {
    if (!dragging) return;
    const w = viewportRef.current?.clientWidth || 1;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > w * 0.15) {
      if (dx < 0) setPage((p) => p + 1);
      else setPage((p) => p - 1);
    }
    setDragging(false);
    setDragX(0);
  };

  const trackStyle: React.CSSProperties = {
    transform: `translate3d(calc(${-page * 100}% + ${dragX}px), 0, 0)`,
    transition: dragging ? 'none' : 'transform .55s cubic-bezier(.22,1,.36,1)',
  };

  // suppress click after a real drag (so cards aren't activated by a swipe)
  const onClickCapture = (e: React.MouseEvent) => {
    if (wasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      wasDragged.current = false;
    }
  };

  return {
    page,
    setPage,
    viewportRef,
    dragging,
    trackStyle,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
      onClickCapture,
    },
  };
}
