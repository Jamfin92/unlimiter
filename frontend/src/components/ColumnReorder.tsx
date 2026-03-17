import { Select, SelectOption } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface ColumnReorderProps {
  headers: string[]
  columnOrder: number[]
  onColumnOrderChange: (order: number[]) => void
}

export function ColumnReorder({ headers, columnOrder, onColumnOrderChange }: ColumnReorderProps) {
  if (headers.length === 0) return null

  function handleSwap(indexA: number, indexB: number) {
    const newOrder = [...columnOrder]
    const temp = newOrder[indexA]
    newOrder[indexA] = newOrder[indexB]
    newOrder[indexB] = temp
    onColumnOrderChange(newOrder)
  }

  function handleReset() {
    onColumnOrderChange(headers.map((_, i) => i))
  }

  const reorderedHeaders = columnOrder.map((i) => headers[i] ?? `Col ${i}`)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Column Order</label>
        <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {reorderedHeaders.map((header, idx) => (
          <span key={idx} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium">
            {idx + 1}. {header}
          </span>
        ))}
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs text-muted-foreground">Swap column</label>
          <Select value="" onValueChange={(val) => {
            const el = document.getElementById("swap-b") as HTMLSelectElement | null
            if (el) el.dataset.swapA = val
          }} placeholder="Column A">
            {reorderedHeaders.map((h, i) => (
              <SelectOption key={i} value={String(i)}>{h}</SelectOption>
            ))}
          </Select>
        </div>
        <div className="flex-1 space-y-1.5">
          <label className="text-xs text-muted-foreground">with</label>
          <Select value="" onValueChange={(val) => {
            const el = document.getElementById("swap-b") as HTMLSelectElement | null
            const swapA = el?.dataset.swapA
            if (swapA !== undefined && swapA !== "") {
              handleSwap(Number(swapA), Number(val))
            }
          }} placeholder="Column B">
            {reorderedHeaders.map((h, i) => (
              <SelectOption key={i} value={String(i)}>{h}</SelectOption>
            ))}
          </Select>
          <div id="swap-b" className="hidden" />
        </div>
      </div>
    </div>
  )
}
