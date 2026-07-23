import { useState } from 'react'
import { Download, FileDown, FileSpreadsheet, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createExcel, createPdf, downloadBlob, fileNameFor, type ExportColumn } from '@/lib/export'

type ExportRecordsProps<T> = {
  title: string
  rows: T[]
  columns: ExportColumn<T>[]
}

export function ExportRecords<T>({ title, rows, columns }: ExportRecordsProps<T>) {
  const [open, setOpen] = useState(false)
  const baseName = fileNameFor(title)
  const pdf = () => createPdf(title, columns, rows)

  const previewPdf = () => {
    const url = URL.createObjectURL(pdf())
    window.open(url, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  return <>
    <Button type="button" size="sm" className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={() => setOpen(true)} disabled={rows.length === 0} title="Export records">
      <Download className="h-4 w-4" />
      <span>Export</span>
    </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Export {title}</DialogTitle>
          <DialogDescription>Preview {rows.length} record{rows.length === 1 ? '' : 's'}, then download as PDF or Excel.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[45vh] overflow-auto rounded-md border">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-muted"><tr>{columns.map((column) => <th key={column.label} className="whitespace-nowrap px-3 py-2 font-medium">{column.label}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex} className="border-t">{columns.map((column) => <td key={column.label} className="max-w-48 px-3 py-2 align-top">{column.value(row) ?? '—'}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={previewPdf}><Eye className="h-4 w-4" />Preview PDF</Button>
          <Button type="button" variant="outline" onClick={() => downloadBlob(pdf(), `${baseName}.pdf`)}><FileDown className="h-4 w-4" />Download PDF</Button>
          <Button type="button" onClick={() => downloadBlob(createExcel(title, columns, rows), `${baseName}.xls`)}><FileSpreadsheet className="h-4 w-4" />Download Excel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
}
