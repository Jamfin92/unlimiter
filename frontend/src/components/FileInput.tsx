import { useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface FileInputProps {
  rawText: string
  onTextChange: (text: string) => void
  detectedDelimiter: string | null
}

export function FileInput({ rawText, onTextChange, detectedDelimiter }: FileInputProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onTextChange(reader.result)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Input</label>
        {detectedDelimiter && (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
            Detected: {detectedDelimiter}
          </span>
        )}
      </div>
      <Textarea
        placeholder="Paste your delimited text here..."
        value={rawText}
        onChange={(e) => onTextChange(e.target.value)}
        rows={8}
        className="font-mono text-sm"
      />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          Upload File
        </Button>
        <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" className="hidden" onChange={handleFile} />
        {rawText && (
          <Button variant="ghost" size="sm" onClick={() => onTextChange("")}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
