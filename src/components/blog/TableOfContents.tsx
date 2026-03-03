"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

/**
 * Table of contents for blog posts.
 * On desktop (lg+): renders as a sticky sidebar.
 * On mobile: renders as a collapsible accordion above the article.
 * Tracks the active heading via IntersectionObserver.
 *
 * Only rendered when there are 3+ headings (controlled by the parent).
 */
export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const tocLinks = (
    <ul className="space-y-2">
      {headings.map(({ id, text }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            onClick={() => setIsOpen(false)}
            className={`block text-sm transition-colors ${
              activeId === id
                ? "text-fern font-medium"
                : "text-charcoal/60 hover:text-fern"
            } focus:outline-none focus-visible:ring-2 focus-visible:ring-fern/50 rounded`}
          >
            {text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile: collapsible accordion */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl border border-oat bg-oat/30 text-sm font-medium text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-fern/50"
          aria-expanded={isOpen}
          aria-controls="toc-mobile"
        >
          Table of Contents
          <svg
            className={`h-4 w-4 text-charcoal/60 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div id="toc-mobile" className="mt-3 px-4">
            {tocLinks}
          </div>
        )}
      </div>

      {/* Desktop: sticky sidebar (rendered inline, positioned by parent grid) */}
      <div className="hidden lg:block">
        <div className="sticky top-28">
          <h2 className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-3">
            On this page
          </h2>
          {tocLinks}
        </div>
      </div>
    </>
  );
}
