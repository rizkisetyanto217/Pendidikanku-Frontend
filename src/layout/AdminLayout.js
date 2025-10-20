import { jsx as _jsx } from "react/jsx-runtime";
// layout/AdminDKMLayout.tsx
import { adminDesktopDataSidebar } from '@/constants/sidebar/AdminDekstopDataSidebar';
import { adminMobileDataSidebar } from '@/constants/sidebar/AdminMobileDataSidebar';
import GenericAdminLayout from './GenericAdminLayout';
export default function AdminLayout() {
    return (_jsx(GenericAdminLayout, { desktopSidebar: adminDesktopDataSidebar, mobileSidebar: adminMobileDataSidebar, topbarTitle: "DKM" }));
}
