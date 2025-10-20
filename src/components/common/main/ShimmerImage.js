import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
export default function ShimmerImage({ src, alt = "image", className = "", style = {}, shimmerClassName = "", onClick, onDoubleClick, }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const lastTapRef = useRef(null);
    const doubleTapDelay = 300; // milliseconds
    // Handler double tap untuk mobile
    const handleTouchEnd = (e) => {
        const now = Date.now();
        if (lastTapRef.current && now - lastTapRef.current < doubleTapDelay) {
            e.preventDefault();
            onDoubleClick?.(e);
            lastTapRef.current = null;
        }
        else {
            lastTapRef.current = now;
        }
    };
    const handleClick = (e) => {
        onClick?.(e);
    };
    return (_jsxs("div", { className: `relative overflow-hidden ${className}`, style: style, children: [!loaded && !error && (_jsx("div", { className: `absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700 ${shimmerClassName}` })), !error && src && (_jsx("img", { src: src, alt: alt, onLoad: () => setLoaded(true), onError: () => setError(true), onClick: handleClick, onDoubleClick: (e) => {
                    e.preventDefault();
                    onDoubleClick?.(e);
                }, onTouchEnd: handleTouchEnd, className: `w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`, style: { cursor: onClick || onDoubleClick ? "pointer" : "default" } }))] }));
}
