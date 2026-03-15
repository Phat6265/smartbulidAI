// Dùng ; (chấm phẩy) để Excel Việt Nam / EU tách đúng cột (comma = dấu thập phân)
const CSV_DELIMITER = ';';

export function objectsToCSV(items, columns) {
  const header = columns.map(c => c.header).join(CSV_DELIMITER) + '\n';
  const rows = items.map(item => columns.map(c => {
    const val = typeof c.accessor === 'function' ? c.accessor(item) : item[c.accessor];
    const s = val == null ? '' : String(val).replace(/"/g, '""');
    return `"${s}"`;
  }).join(CSV_DELIMITER)).join('\n');
  return header + rows;
}

// BOM UTF-8 để Excel mở file tiếng Việt đúng font
const UTF8_BOM = '\uFEFF';

export function downloadCSV(filename, csvContent) {
  const blob = new Blob([UTF8_BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
