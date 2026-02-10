"use client";

import { useEffect, useRef, useState } from "react";

type TurnstileCaptchaProps = {
  refreshKey: number;
  onTokenChange: (token: string | null) => void;
};

type TurnstileWidgetId = string | number;

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        }
      ) => TurnstileWidgetId;
      reset: (widgetId?: TurnstileWidgetId) => void;
      remove: (widgetId: TurnstileWidgetId) => void;
    };
  }
}

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";

function loadTurnstileScript() {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.turnstile) {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Turnstile script.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile script."));
    document.head.appendChild(script);
  });
}

export default function TurnstileCaptcha({ refreshKey, onTokenChange }: TurnstileCaptchaProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    onTokenChange(null);
    setLoadError(null);

    if (!siteKey) {
      setLoadError("未配置 NEXT_PUBLIC_TURNSTILE_SITE_KEY。");
      return;
    }

    loadTurnstileScript()
      .then(() => {
        if (disposed || !containerRef.current || !window.turnstile) {
          return;
        }

        containerRef.current.innerHTML = "";
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            onTokenChange(token);
          },
          "expired-callback": () => {
            onTokenChange(null);
          },
          "error-callback": () => {
            onTokenChange(null);
            setLoadError("验证码校验失败，请刷新后重试。");
          },
          theme: "light",
          size: "normal",
        });
      })
      .catch(() => {
        if (!disposed) {
          setLoadError("验证码组件加载失败，请检查网络后重试。");
        }
      });

    return () => {
      disposed = true;
      if (widgetIdRef.current !== null && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [onTokenChange, refreshKey, siteKey]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">人机验证</label>
      <div ref={containerRef} />
      {loadError ? <p className="text-xs text-amber-700">{loadError}</p> : null}
    </div>
  );
}
