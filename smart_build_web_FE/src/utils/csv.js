export function objectsToCSV(items, columns) {
  const header = columns.map(c => c.header).join(',') + '\n';
  const rows = items.map(item => columns.map(c => {
    const val = typeof c.accessor === 'function' ? c.accessor(item) : item[c.accessor];
    // Escape quotes
    const s = val == null ? '' : String(val).replace(/"/g, '""');
    return `"${s}"`;
  }).join(',')).join('\n');
  return header + rows;
}

export function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
