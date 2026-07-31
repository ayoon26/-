import { NavLink } from "react-router-dom";
import clsx from "clsx";

const ITEMS = [
  { to: "/today", label: "Today", icon: "🌤️" },
  { to: "/money", label: "Money", icon: "💰" },
  { to: "/progress", label: "Progress", icon: "🌱" },
  { to: "/profile", label: "Profile", icon: "🙂" },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="safe-bottom fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-app justify-around border-t border-line bg-surface/95 backdrop-blur"
    >
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              "flex min-w-16 flex-col items-center gap-0.5 px-2 py-2.5 text-xs font-medium",
              isActive ? "text-sprout-600" : "text-ink-faint"
            )
          }
        >
          {({ isActive }) => (
            <>
              <span aria-hidden="true" className="text-lg leading-none">
                {item.icon}
              </span>
              <span>{item.label}</span>
              <span className="sr-only">{isActive ? " (current)" : ""}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
