import { useState, useEffect, useCallback } from "react";
import { BeforeInstallPromptEvent } from "../../dataTypeDefinitions";

export function usePWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // @ts-ignore: the DOM type for this event isn't yet in TypeScript lib
      const evt = e as BeforeInstallPromptEvent;
      e.preventDefault(); // stop the browser from prompting immediately
      setDeferredPrompt(evt); // save it for later
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); // show the install prompt
    const choice = await deferredPrompt.userChoice; // wait for the user to accept or dismiss
    // choice.outcome is either 'accepted' or 'dismissed'
    console.log("PWA install choice:", choice.outcome);
    setDeferredPrompt(null); // you can’t reuse the event
  }, [deferredPrompt]);

  return { deferredPrompt, promptInstall };
}
