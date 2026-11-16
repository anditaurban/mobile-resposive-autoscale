import React from 'react';

export interface TreeNodeData {
  id: string | number;
  code: string;
  name: string;
  balance?: number;
  is_header?: boolean;
  children?: TreeNodeData[];
}

interface MobileTreeNodeProps {
  node: TreeNodeData;
  level?: number;
  isExpanded: boolean;
  onToggle: (id: string | number) => void;
  onAddSub: (node: TreeNodeData) => void;
  onEdit: (node: TreeNodeData) => void;
  onDelete: (node: TreeNodeData) => void;
}

function formatCurrency(val?: number): string {
  if (val === undefined || val === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
}

export const MobileTreeNode: React.FC<MobileTreeNodeProps> = ({
  node,
  level = 0,
  isExpanded,
  onToggle,
  onAddSub,
  onEdit,
  onDelete,
}) => {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isHeader = Boolean(node.is_header || level < 2);

  return (
    <div className="border-b border-slate-100 dark:border-slate-800/80">
      <div
        className={`p-3 transition-colors ${
          isHeader
            ? 'bg-slate-50/70 dark:bg-slate-800/50 font-bold'
            : 'bg-white dark:bg-slate-900 font-medium'
        }`}
        style={{ paddingLeft: `${Math.max(12, level * 14 + 12)}px` }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren ? (
              <button
                onClick={() => onToggle(node.id)}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
                aria-label={isExpanded ? 'Tutup cabang' : 'Buka cabang'}
              >
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <span className="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-700 text-xs">
                •
              </span>
            )}

            <div className="min-w-0">
              <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 mr-1.5">
                {node.code}
              </span>
              <span className="text-xs text-slate-900 dark:text-slate-100 truncate">
                {node.name}
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-emerald-400">
              {formatCurrency(node.balance)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1 mt-2 pt-1.5 border-t border-slate-100/60 dark:border-slate-800/40">
          <button
            onClick={() => onAddSub(node)}
            className="text-[10px] font-bold px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
          >
            + Sub
          </button>
          <button
            onClick={() => onEdit(node)}
            className="text-[10px] font-bold px-2 py-0.5 rounded text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(node)}
            className="text-[10px] font-bold px-2 py-0.5 rounded text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
          >
            Hapus
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <MobileTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
              onAddSub={onAddSub}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
