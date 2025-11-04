// src/pages/pendidikanku-dashboard/components/common/CButtonAction.tsx
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
}

/**
 * 🔘 Komponen Reusable untuk aksi (Lihat, Edit, Hapus)
 * - Gunakan di tabel atau kartu data
 * - Contoh:
 *   <CButtonAction
 *      palette={palette}
 *      onView={() => navigate(`/detail/${id}`)}
 *      onEdit={() => setModal({mode:'edit', editing:item})}
 *      onDelete={() => deleteItem.mutate(id)}
 *   />
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
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* 👁️ Tombol Lihat Detail */}
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

      {/* ✏️ Tombol Edit */}
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

      {/* 🗑️ Tombol Hapus */}
      {!disableDelete && (
        <Btn
          palette={palette}
          size={size}
          variant="destructive"
          className="p-2"
          title="Hapus"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </Btn>
      )}
    </div>
  );
};

export default CButtonAction;
