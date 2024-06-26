"use client";

import { Theme } from "@/config/themes";
import { useConfig } from "@/store/use-config";
import { useEffect, useState } from "react";

export default function ThemeWrapper({
  children,
  defaultTheme,
  ...props
}: React.ComponentProps<"div"> & { defaultTheme: Theme["name"] }) {
  const [config] = useConfig();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    document.body.classList.forEach((className) => {
      if (className.startsWith("theme")) {
        document.body.classList.remove(className);
        document.body.classList.add(`theme-${config.theme}`);
      }
    });
  }, [config]);

  return (
    mounted && (
      <div
        className={"w-full"}
        style={
          {
            "--radius": `${config.radius}rem`,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    )
  );
}
