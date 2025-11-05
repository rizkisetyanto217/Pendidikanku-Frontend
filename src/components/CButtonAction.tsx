// src/pages/pendidikanku-dashboard/components/CButtonAction.tsx
import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Btn, type Palette } from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

interface CButtonActionProps {
  palette: Palette;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "secondary";
  disableView?: boolean;
  disableEdit?: boolean;
  disableDelete?: boolean;
  confirmMessage?: string; // ✅ Tambahkan prop ini
}

/**
 * 🔘 Komponen Reusable untuk aksi (Lihat, Edit, Hapus)
 */
const CButtonAction: React.FC<CButtonActionProps> = ({
  palette,
  onView,
  onEdit,
  onDelete,
  size = "sm",
  variant = "outline",
  disableView,
  disableEdit,
  disableDelete,
  confirmMessage,
}) => {
  const handleDeleteClick = () => {
    if (!onDelete) return;
    // ✅ tampilkan alert konfirmasi bawaan browser
    if (confirmMessage) {
      const ok = window.confirm(confirmMessage);
      if (ok) onDelete();
    } else {
      onDelete();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 👁️ Lihat */}
      {!disableView && (
        <Btn
          palette={palette}
          size={size}
          variant={variant}
          className="p-2"
          title="Lihat Detail"
          onClick={onView}
        >
          <Eye size={16} />
        </Btn>
      )}

      {/* ✏️ Edit */}
      {!disableEdit && (
        <Btn
          palette={palette}
          size={size}
          variant="secondary"
          className="p-2"
          title="Edit"
          onClick={onEdit}
        >
          <Pencil size={16} />
        </Btn>
      )}

      {/* 🗑️ Hapus */}
      {!disableDelete && (
        <Btn
          palette={palette}
          size={size}
          variant="destructive"
          className="p-2"
          title="Hapus"
          onClick={handleDeleteClick} // ✅ Panggil handler baru
        >
          <Trash2 size={16} />
        </Btn>
      )}
    </div>
  );
};

export default CButtonAction;
