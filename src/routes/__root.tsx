import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { CreatedWithGrokBanner } from "@/components/created-with-grok-banner";
import { AuthProvider } from "@/lib/auth/provider";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import appCss from "../styles.css?url";

const APP_NAME = "ClassNest";
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host
  ? `https://og.grok.me/v1/card.png?host=${encodeURIComponent(host)}&title=${encodeURIComponent(APP_NAME)}`
  : undefined;

/** Runs before paint so theme + smartboard class don't flash. Smartboard defaults ON. */
const bootScript = `(function(){try{
  var d=document.documentElement;
  var k=${JSON.stringify(THEME_STORAGE_KEY)};
  var t=localStorage.getItem(k);
  if(t!=="light"&&t!=="dark"){
    t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
  }
  d.classList.toggle("dark",t==="dark");
  d.style.colorScheme=t;
  // Smartboard ON unless explicitly disabled ("0")
  var sb=localStorage.getItem("classnest-smartboard");
  d.classList.toggle("smartboard", sb!=="0");
}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        // Seewo / smartboards: avoid double-tap page zoom stealing taps from +1
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1",
      },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "description",
        content:
          "Classroom points for kids, teens & Ultra — tuned for Seewo smartboards and tablets.",
      },
      { title: APP_NAME },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <CreatedWithGrokBanner />
        <AuthProvider>
          <Outlet />
          <Toaster
            position="top-center"
            richColors
            closeButton
            expand
            visibleToasts={3}
            offset="4.5rem"
            style={{ zIndex: 2147483646 }}
            toastOptions={{
              className: "font-sans",
              duration: 3200,
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
