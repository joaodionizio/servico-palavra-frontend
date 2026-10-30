"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

type UseFocusTrapOptions = {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onEscape?: () => void;
  initialFocusSelector?: string;
  restoreFocus?: boolean;
};

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
    const style = window.getComputedStyle(element);
    return !element.hasAttribute("hidden") && style.display !== "none" && style.visibility !== "hidden";
  });
}

export function useFocusTrap({
  active,
  containerRef,
  onEscape,
  initialFocusSelector,
  restoreFocus = true
}: UseFocusTrapOptions) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;
    const trapContainer: HTMLElement = container;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const explicitInitialFocus = initialFocusSelector
      ? trapContainer.querySelector<HTMLElement>(initialFocusSelector)
      : null;
    const focusable = getFocusableElements(trapContainer);
    const initialFocus = explicitInitialFocus ?? focusable[0] ?? trapContainer;

    if (!trapContainer.hasAttribute("tabindex") && initialFocus === trapContainer) {
      trapContainer.tabIndex = -1;
    }

    requestAnimationFrame(() => initialFocus.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key !== "Tab") return;

      const items = getFocusableElements(trapContainer);
      if (items.length === 0) {
        event.preventDefault();
        trapContainer.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !trapContainer.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (restoreFocus && previouslyFocused?.isConnected) {
        requestAnimationFrame(() => previouslyFocused.focus());
      }
    };
  }, [active, containerRef, initialFocusSelector, onEscape, restoreFocus]);
}
