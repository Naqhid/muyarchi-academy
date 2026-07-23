export type ExportColumn<T> = {
  label: string
  value: (item: T) => string | number | null | undefined
}

type PdfLine = { text: string; y: number; size: number; x?: number; bold?: boolean }

const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;')
  .replace(/'/g, '&#39;')

const pdfText = (value: unknown) => String(value ?? '')
  .replace(/[\\()]/g, '\\$&')
  .replace(/[^\x20-\x7E]/g, '?')

export const fileNameFor = (title: string) => `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${new Date().toISOString().slice(0, 10)}`

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function createExcel<T>(title: string, columns: ExportColumn<T>[], rows: T[]) {
  const table = `<table><thead><tr>${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${columns.map((column) => `<td>${escapeHtml(column.value(row))}</td>`).join('')}</tr>`).join('')}</tbody></table>`
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title><style>table{border-collapse:collapse}th,td{border:1px solid #999;padding:6px;text-align:left}th{background:#e5e7eb;font-weight:700}</style></head><body><h1>${escapeHtml(title)}</h1>${table}</body></html>`
  return new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8' })
}

// A small standards-compliant PDF generator for the tabular exports. It avoids a large
// client-side dependency and works offline in the admin panel.
export function createPdf<T>(title: string, columns: ExportColumn<T>[], rows: T[]) {
  const maxColumns = Math.min(columns.length, 8)
  const activeColumns = columns.slice(0, maxColumns)
  const columnWidth = 540 / maxColumns
  const lines: PdfLine[] = [
    { text: title, y: 800, size: 18 },
    { text: `Generated: ${new Date().toLocaleString('en-IN')}`, y: 780, size: 9 },
    ...activeColumns.map((column, index) => ({ text: column.label, x: 36 + index * columnWidth, y: 754, size: 9, bold: true })),
    ...rows.flatMap((row, rowIndex) => activeColumns.map((column, columnIndex) => ({
      text: String(column.value(row) ?? '').replace(/\s+/g, ' ').slice(0, maxColumns > 4 ? 16 : 31),
      x: 36 + columnIndex * columnWidth,
      y: 738 - rowIndex * 16,
      size: 8,
    }))),
  ]

  const pageRows = 42
  const pageCount = Math.max(1, Math.ceil(rows.length / pageRows))
  const objects: string[] = ['<< /Type /Catalog /Pages 2 0 R >>']
  const pageIds = Array.from({ length: pageCount }, (_, index) => 3 + index * 2)
  objects.push(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageCount} >>`)

  for (let page = 0; page < pageCount; page++) {
    const pageLines: PdfLine[] = page === 0
      ? lines.filter((line) => line.y >= 738 - (pageRows - 1) * 16)
      : [
          { text: `${title} (continued)`, y: 800, size: 14 },
          ...activeColumns.map((column, index) => ({ text: column.label, x: 36 + index * columnWidth, y: 776, size: 9, bold: true })),
          ...rows.slice(page * pageRows, (page + 1) * pageRows).flatMap((row, rowIndex) => activeColumns.map((column, columnIndex) => ({ text: String(column.value(row) ?? '').replace(/\s+/g, ' ').slice(0, maxColumns > 4 ? 16 : 31), x: 36 + columnIndex * columnWidth, y: 760 - rowIndex * 16, size: 8 }))),
        ]
    const commands = pageLines.map((line) => `BT /${line.bold ? 'F2' : 'F1'} ${line.size} Tf ${line.x ?? 36} ${line.y} Td (${pdfText(line.text)}) Tj ET`).join('\n')
    const pageId = pageIds[page]
    const contentId = pageId + 1
    objects[pageId - 1] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 ${pageCount * 2 + 3} 0 R /F2 ${pageCount * 2 + 4} 0 R >> >> /Contents ${contentId} 0 R >>`
    objects[contentId - 1] = `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`
  }
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')
  const content = ['%PDF-1.4']
  const offsets = [0]
  let offset = content[0].length + 1
  objects.forEach((object, index) => {
    offsets.push(offset)
    const entry = `${index + 1} 0 obj\n${object}\nendobj`
    content.push(entry)
    offset += entry.length + 1
  })
  const xrefOffset = offset
  content.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((item) => `${String(item).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`)
  return new Blob([content.join('\n')], { type: 'application/pdf' })
}
