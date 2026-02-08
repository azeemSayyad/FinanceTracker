"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
    name: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const COLORS = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-indigo-500",
    "bg-rose-500",
    "bg-cyan-500",
];

export function Avatar({ name, className, size = "md" }: AvatarProps) {
    const firstLetter = name.charAt(0).toUpperCase();

    // Simple hash function to consistently pick a color based on name
    const getIndex = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % COLORS.length;
    };

    const bgColor = COLORS[getIndex(name)];

    const sizeClasses = {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-2xl",
    };

    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-full font-bold text-white shadow-sm ring-2 ring-background/10",
                bgColor,
                sizeClasses[size],
                className
            )}
        >
            {firstLetter}
        </div>
    );
}
