import { jsx as _jsx } from "react/jsx-runtime";
// src/components/auth/GoogleIdentityButton.tsx
import { useEffect, useRef } from "react";
import { loadGsiScript } from "@/pages/dashboard/auth/utils/loadGsiScript";
const GoogleIdentityButton = ({ clientId, onSuccess, theme = "filled_blue", size = "large", text = "continue_with", autoSelect = false, maxWidth = 400, className, }) => {
    const btnRef = useRef(null);
    useEffect(() => {
        let ro = null;
        const init = async () => {
            await loadGsiScript();
            if (!window.google || !btnRef.current)
                return;
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (resp) => {
                    const cred = resp?.credential;
                    if (cred)
                        onSuccess(cred);
                },
                auto_select: autoSelect,
            });
            const render = () => {
                if (!btnRef.current)
                    return;
                btnRef.current.innerHTML = "";
                const width = Math.min(btnRef.current.offsetWidth || maxWidth, maxWidth);
                window.google.accounts.id.renderButton(btnRef.current, {
                    theme,
                    size,
                    text,
                    shape: "rectangular",
                    logo_alignment: "left",
                    width,
                });
            };
            render();
            ro = new ResizeObserver(render);
            ro.observe(btnRef.current);
        };
        init();
        return () => {
            if (ro && btnRef.current)
                ro.disconnect();
        };
    }, [clientId, onSuccess, theme, size, text, autoSelect, maxWidth]);
    return _jsx("div", { ref: btnRef, className: className });
};
export default GoogleIdentityButton;
