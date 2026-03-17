export function objectsToCSV(items, columns) {
  // Dùng dấu chấm phẩy cho tương thích Excel (locale vi-VN)
  const SEP = ';';
  const header = columns.map((c) => c.header).join(SEP) + '\n';
  const rows = items
    .map((item) =>
      columns
        .map((c) => {
          const val = typeof c.accessor === 'function' ? c.accessor(item) : item[c.accessor];
          // Escape quotes
          const s = val == null ? '' : String(val).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(SEP)
    )
    .join('\n');
  return header + rows;
}

export function downloadCSV(filename, csvContent) {
  // Thêm BOM để Excel Windows nhận đúng UTF-8 và tiếng Việt
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
