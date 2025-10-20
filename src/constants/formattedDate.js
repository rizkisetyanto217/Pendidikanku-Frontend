import { jsx as _jsx } from "react/jsx-runtime";
import { formatInTimeZone } from "date-fns-tz";
import { id as localeID } from "date-fns/locale";
export default function FormattedDate({ value, fullMonth = false, className = "", }) {
    const formatPattern = fullMonth
        ? "EEEE, dd MMMM yyyy - HH:mm"
        : "EEEE, dd MMM yyyy - HH:mm";
    const formatted = formatInTimeZone(value, "UTC", formatPattern, {
        locale: localeID,
    });
    return _jsx("span", { className: className, children: formatted });
}
