"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface BottomNavClientProps {
  active: "book" | "history" | "profile" | "support"
}

const items = [
  {
    id: "book",
    label: "Book",
    href: "/client/book",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "History",
    href: "/client/history",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "support",
    label: "Infos",
    href: "/client/support",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    href: "/client/profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
] as const

export function BottomNavClient({ active }: BottomNavClientProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] safe-area-bottom"
      style={{ background: "white", borderTop: "1px solid #e5e7eb" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all"
            >
              {/* Pastille active style Dem Dikk */}
              <div
                className={cn(
                  "flex items-center justify-center rounded-full transition-all duration-200",
                  isActive
                    ? "px-4 py-1.5 gap-1.5"
                    : "p-1"
                )}
                style={isActive ? { backgroundColor: "#0066CC" } : {}}
              >
                <span style={{ color: isActive ? "white" : "#6b7280" }}>
                  {item.icon}
                </span>
                {isActive && (
                  <span className="text-xs font-semibold text-white whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </div>
              {!isActive && (
                <span className="text-[10px] font-medium text-gray-400">{item.label}</span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
