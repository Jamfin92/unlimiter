import { Button } from "@/components/ui/button"

interface DownloadButtonProps {
  convertedText: string
  toDelimiter: string
}

function getExtension(delimiter: string): string {
  switch (delimiter) {
    case ",": return ".csv"
    case "\t": return ".tsv"
    default: return ".txt"
  }
}

export function DownloadButton({ convertedText, toDelimiter }: DownloadButtonProps) {
  if (!convertedText) return null

  function handleDownload() {
    const ext = getExtension(toDelimiter)
    const blob = new Blob([convertedText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `converted${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={handleDownload}>
      Download {getExtension(toDelimiter)}
    </Button>
  )
}
