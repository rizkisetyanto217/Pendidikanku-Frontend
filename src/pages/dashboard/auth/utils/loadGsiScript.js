// src/utils/loadGsiScript.ts
let gsiScriptLoading = null;
export function loadGsiScript() {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
        return Promise.resolve();
    }
    if (gsiScriptLoading)
        return gsiScriptLoading;
    gsiScriptLoading = new Promise((resolve, reject) => {
        const existing = document.getElementById("google-identity");
        if (existing) {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", (e) => reject(e));
            return;
        }
        const s = document.createElement("script");
        s.id = "google-identity";
        s.src = "https://accounts.google.com/gsi/client";
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.body.appendChild(s);
    });
    return gsiScriptLoading;
}
