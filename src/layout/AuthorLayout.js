import { jsx as _jsx } from "react/jsx-runtime";
import GenericAdminLayout from './GenericAdminLayout';
import { authorDesktopDataSidebar } from '@/constants/sidebar/AuthorDekstopDataSidebar';
import { authorMobileDataSidebar } from '@/constants/sidebar/AuthorMobileDataSidebar';
export default function AuthorLayout() {
    return (_jsx(GenericAdminLayout, { desktopSidebar: authorDesktopDataSidebar, mobileSidebar: authorMobileDataSidebar, topbarTitle: "Penulis" }));
}
