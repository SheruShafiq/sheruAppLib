import { useState, useEffect, useCallback } from "react";
import { BeforeInstallPromptEvent } from "../../dataTypeDefinitions";

export function usePWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      
      const evt = e as BeforeInstallPromptEvent;
      e.preventDefault(); 
      setDeferredPrompt(evt); 
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); 
    const choice = await deferredPrompt.userChoice; 
    
    console.log("PWA install choice:", choice.outcome);
    setDeferredPrompt(null); 
  }, [deferredPrompt]);

  return { deferredPrompt, promptInstall };
}
