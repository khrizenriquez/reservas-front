"use client";

import { useEffect, useRef } from "react";

export function Modal({ isOpen, onClose, title, closeLabel, children, dismissible = true }) {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  useEffect(() => {
    if (!isOpen) return undefined;
    previousFocus.current = document.activeElement;
    const onKeyDown = (event) => { if (event.key === "Escape" && dismissible) onClose(); };
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKeyDown); previousFocus.current?.focus?.(); };
  }, [dismissible, isOpen, onClose]);
  if (!isOpen) return null;
  return <div className="app-modal" role="presentation" onMouseDown={(event) => { if (dismissible && event.target === event.currentTarget) onClose(); }}>
    <section className="app-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex="-1" ref={dialogRef}>
      <header className="app-modal-header"><h2 id="modal-title">{title}</h2>{dismissible ? <button className="app-modal-close" type="button" onClick={onClose} aria-label={closeLabel}>×</button> : null}</header>
      <div className="app-modal-content">{children}</div>
    </section>
  </div>;
}
