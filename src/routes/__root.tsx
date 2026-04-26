import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/CommandPalette";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1
          className="bg-clip-text text-7xl font-bold text-transparent"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          404
        </h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kingdom v2000 — Modular App Platform" },
      {
        name: "description",
        content:
          "A public, AI-powered modular starter. Notes, analytics, command palette and a streaming AI assistant — no sign-in required.",
      },
      { property: "og:title", content: "Kingdom v2000 — Modular App Platform" },
      { name: "twitter:title", content: "Kingdom v2000 — Modular App Platform" },
      { name: "description", content: "Feature Forge is a prompt-driven full-stack web app scaffold that generates applications with UI, backend, and authentication." },
      { property: "og:description", content: "Feature Forge is a prompt-driven full-stack web app scaffold that generates applications with UI, backend, and authentication." },
      { name: "twitter:description", content: "Feature Forge is a prompt-driven full-stack web app scaffold that generates applications with UI, backend, and authentication." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1d60e016-7bc8-4984-9bf1-8f96a1296e7b/id-preview-e3dc0e31--1c5fe20f-f538-4426-9a17-37290898e587.lovable.app-1777169328659.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1d60e016-7bc8-4984-9bf1-8f96a1296e7b/id-preview-e3dc0e31--1c5fe20f-f538-4426-9a17-37290898e587.lovable.app-1777169328659.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <CommandPalette />
      <Toaster />
    </>
  );
}
