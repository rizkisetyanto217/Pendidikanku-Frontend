import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const TestimonialSlider = ({ items, theme, className = "", autoplayDelayMs = 4000, showArrows = true, }) => {
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsx(Swiper, { modules: [Navigation, Pagination, Autoplay], slidesPerView: 1, navigation: showArrows, pagination: { clickable: true }, autoplay: { delay: autoplayDelayMs, disableOnInteraction: false }, breakpoints: {
                    768: { slidesPerView: 2, spaceBetween: 10 },
                    1024: { slidesPerView: 2, spaceBetween: 10 },
                }, className: "pb-10", style: {
                    "--swiper-theme-color": theme.primary,
                }, children: items.map((t, idx) => {
                    const stars = Math.max(1, Math.min(t.rating ?? 5, 5));
                    return (_jsx(SwiperSlide, { children: _jsx("blockquote", { className: "rounded-3xl border shadow-sm p-5 h-full flex flex-col justify-center mx-auto transition hover:shadow max-w-3xl", style: {
                                backgroundColor: theme.white1,
                                borderColor: theme.white3,
                            }, children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("img", { src: t.img, alt: t.name, className: "h-14 w-14 rounded-2xl object-cover", loading: "lazy" }), _jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-1", style: { color: theme.warning1 }, children: Array.from({ length: stars }).map((_, i) => (_jsx(Star, { className: "h-4 w-4 fill-current" }, i))) }), _jsxs("p", { className: "mt-2 text-sm", style: { color: theme.black1 }, children: ["\u201C", t.quote, "\u201D"] }), _jsxs("footer", { className: "mt-3 text-xs", style: { color: theme.silver2 }, children: [t.name, " \u2022 ", t.role] })] })] }) }) }, `${t.name}-${idx}`));
                }) }), showArrows && (_jsx("style", { children: `
          .swiper-button-next,
          .swiper-button-prev {
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 40px;
            height: 40px;
            border-radius: 9999px;
            background: ${theme.white1};
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          }
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 16px !important;
            color: ${theme.black1};
          }
        ` }))] }));
};
export default TestimonialSlider;
