import React from 'react';

interface DataItem {
  id: string | number;
  code: string;
  name: string;
  category?: string;
  amount: number;
  status: string;
}

interface ResponsiveDataTableProps {
  data: DataItem[];
  onView: (item: DataItem) => void;
  onEdit: (item: DataItem) => void;
  onDelete: (item: DataItem) => void;
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
}

function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'aktif':
    case 'selesai':
    case 'paid':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    case 'pending':
    case 'menunggu':
      return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    case 'batal':
    case 'gagal':
      return 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    default:
      return 'bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

export const ResponsiveDataTable: React.FC<ResponsiveDataTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* 1. Desktop Table View (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Kode / ID</th>
              <th className="py-3 px-4">Nama</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4 text-right">Nominal</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{item.code}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-100">{item.name}</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{item.category || '-'}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                  {formatCurrency(item.amount)}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => onView(item)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Stacked Card View (< 768px) */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {data.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">Belum ada data</div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="min-w-0 flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 truncate">
                    {item.code}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {item.name}
                  </span>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-2.5 text-[11px]">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider block">
                    Kategori
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                    {item.category || '-'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider block">
                    Nominal
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 block">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-0.5">
                <button
                  onClick={() => onView(item)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Detail
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
