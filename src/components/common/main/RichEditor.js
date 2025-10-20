import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import DOMPurify from "dompurify";
export default function RichEditor({ value, onChange, label, placeholder = "Tulis deskripsi kajian...", }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const editorRef = useRef(null);
    const selectionRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [, setRefreshToolbar] = useState(0);
    useEffect(() => {
        if (editorRef.current) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = value || "";
            const current = editorRef.current.innerHTML.trim();
            const incoming = tempDiv.innerHTML.trim();
            if (current !== incoming) {
                editorRef.current.innerHTML = value || "";
                // Optional: Pindahkan kursor ke akhir konten
                const range = document.createRange();
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                const sel = window.getSelection();
                if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }
    }, [value]);
    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            selectionRef.current = sel.getRangeAt(0);
        }
    };
    const restoreSelection = () => {
        const sel = window.getSelection();
        if (sel && selectionRef.current) {
            sel.removeAllRanges();
            sel.addRange(selectionRef.current);
        }
    };
    const applyFormat = (command, value) => {
        if (!editorRef.current)
            return;
        editorRef.current.focus();
        const html = editorRef.current.innerHTML.trim();
        const isEmpty = !html || html === "<br>" || html === "<p><br></p>";
        if (isEmpty && command === "formatBlock" && value === "<p>") {
            document.execCommand("formatBlock", false, "p");
        }
        restoreSelection();
        document.execCommand(command, false, value);
        onChange(DOMPurify.sanitize(editorRef.current.innerHTML));
        setRefreshToolbar((prev) => prev + 1);
    };
    const isActive = (command) => {
        if (!isFocused)
            return false;
        try {
            return document.queryCommandState(command);
        }
        catch {
            return false;
        }
    };
    const currentBlock = () => {
        const sel = window.getSelection();
        const isInEditor = sel && editorRef.current?.contains(sel.anchorNode);
        if (!isInEditor)
            return "";
        try {
            return document.queryCommandValue("formatBlock");
        }
        catch {
            return "";
        }
    };
    useEffect(() => {
        const handler = () => setRefreshToolbar((v) => v + 1);
        document.addEventListener("selectionchange", handler);
        return () => document.removeEventListener("selectionchange", handler);
    }, []);
    useEffect(() => {
        const keyHandler = (e) => {
            if (!editorRef.current)
                return;
            const sel = window.getSelection();
            const block = sel?.anchorNode?.parentElement;
            if (e.key === "Enter" && !e.shiftKey) {
                const isInsideBlockquote = block?.closest("blockquote");
                if (isInsideBlockquote) {
                    e.preventDefault();
                    const newParagraph = document.createElement("p");
                    newParagraph.innerHTML = "<br>";
                    isInsideBlockquote.parentNode?.insertBefore(newParagraph, isInsideBlockquote.nextSibling);
                    // Set cursor ke paragraf baru
                    const range = document.createRange();
                    range.setStart(newParagraph, 0);
                    range.collapse(true);
                    const sel = window.getSelection();
                    if (sel) {
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    editorRef.current.focus();
                    setRefreshToolbar((v) => v + 1);
                }
            }
            if (!e.ctrlKey && !e.metaKey)
                return;
            const key = e.key.toLowerCase();
            const map = {
                b: () => applyFormat("bold"),
                i: () => applyFormat("italic"),
                u: () => applyFormat("underline"),
                p: () => applyFormat("formatBlock", "<p>"),
            };
            if (/^[1-6]$/.test(key)) {
                e.preventDefault();
                applyFormat("formatBlock", `<h${key}>`);
            }
            else if (map[key]) {
                e.preventDefault();
                map[key]();
            }
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    }, []);
    const toolbarButtons = [
        { label: "B", command: "bold", className: "font-bold" },
        { label: "I", command: "italic", className: "italic" },
        { label: "U", command: "underline", className: "underline" },
        { label: "• List", command: "insertUnorderedList" },
        { label: "1. List", command: "insertOrderedList" },
        { label: "Quote", command: "formatBlock", value: "<blockquote>" },
        { label: "Link", command: "createLink" },
    ];
    const headingButtons = [1, 2, 3, 4].map((n) => ({
        label: `H${n}`,
        command: "formatBlock",
        value: `<h${n}>`,
    }));
    const paragraphButton = { label: "P", command: "formatBlock", value: "<p>" };
    return (_jsxs("div", { className: "w-full space-y-2", children: [label && (_jsx("label", { className: "text-sm font-medium", style: { color: theme.black2 }, children: label })), _jsxs("div", { className: "w-full p-4 rounded-lg space-y-2", style: {
                    backgroundColor: theme.primary2,
                    border: `1px solid ${theme.primary}`,
                }, children: [_jsxs("div", { className: "flex flex-wrap gap-2 mb-1 text-sm", children: [toolbarButtons.map(({ label, command, className, value }) => {
                                const active = isActive(command);
                                return (_jsx("button", { type: "button", onMouseDown: (e) => {
                                        e.preventDefault();
                                        saveSelection();
                                        if (command === "createLink") {
                                            const url = prompt("Masukkan URL:");
                                            if (url) {
                                                let finalUrl = url.trim();
                                                if (!/^https?:\/\//i.test(finalUrl)) {
                                                    finalUrl = "https://" + finalUrl;
                                                }
                                                applyFormat("createLink", finalUrl);
                                            }
                                        }
                                        else {
                                            applyFormat(command, value);
                                        }
                                    }, className: `border px-2 rounded ${className ?? ""} ${active ? "bg-blue-500 text-white" : ""}`, children: label }, label));
                            }), [...headingButtons, paragraphButton].map(({ label, command, value }) => {
                                const isCurrent = currentBlock()?.toLowerCase() === value?.replace(/[<>]/g, "");
                                return (_jsx("button", { type: "button", onMouseDown: (e) => {
                                        e.preventDefault();
                                        saveSelection();
                                        applyFormat(command, value);
                                    }, className: `border px-2 rounded text-sm ${isCurrent ? "bg-green-500 text-white" : ""}`, children: label }, label));
                            })] }), _jsx("div", { ref: editorRef, contentEditable: true, dir: "ltr", suppressContentEditableWarning: true, onInput: () => {
                            if (editorRef.current) {
                                onChange(editorRef.current.innerHTML);
                                setRefreshToolbar((prev) => prev + 1);
                            }
                        }, onFocus: () => {
                            setIsFocused(true);
                            setRefreshToolbar((v) => v + 1);
                        }, onBlur: () => setIsFocused(false), className: "w-full min-h-[200px] text-sm rounded border p-2 max-w-none prose prose-sm dark:prose-invert", style: {
                            backgroundColor: theme.white2,
                            color: theme.black1,
                            borderColor: theme.silver1,
                        }, "data-placeholder": placeholder })] })] }));
}
