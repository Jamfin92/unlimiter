import { Select, SelectOption } from "@/components/ui/select"
import { DELIMITER_OPTIONS } from "@/types"

interface DelimiterPickerProps {
  fromDelimiter: string
  toDelimiter: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}

export function DelimiterPicker({ fromDelimiter, toDelimiter, onFromChange, onToChange }: DelimiterPickerProps) {
  return (
    <div className="flex items-end gap-4">
      <div className="flex-1 space-y-1.5">
        <label className="text-sm font-medium">From</label>
        <Select value={fromDelimiter} onValueChange={onFromChange}>
          {DELIMITER_OPTIONS.map((opt) => (
            <SelectOption key={opt.value} value={opt.value}>{opt.label}</SelectOption>
          ))}
        </Select>
      </div>
      <div className="flex items-center pb-2 text-muted-foreground">→</div>
      <div className="flex-1 space-y-1.5">
        <label className="text-sm font-medium">To</label>
        <Select value={toDelimiter} onValueChange={onToChange}>
          {DELIMITER_OPTIONS.map((opt) => (
            <SelectOption key={opt.value} value={opt.value}>{opt.label}</SelectOption>
          ))}
        </Select>
      </div>
    </div>
  )
}
