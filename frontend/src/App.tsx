import { useState, useEffect, useRef, useCallback } from "react"
import { Toaster, toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FileInput } from "@/components/FileInput"
import { DelimiterPicker } from "@/components/DelimiterPicker"
import { ColumnReorder } from "@/components/ColumnReorder"
import { Preview } from "@/components/Preview"
import { DownloadButton } from "@/components/DownloadButton"
import { detectDelimiter, convertDelimiter } from "@/api/delimiter"

export default function App() {
  const [rawText, setRawText] = useState("")
  const [fromDelimiter, setFromDelimiter] = useState(",")
  const [toDelimiter, setToDelimiter] = useState("\t")
  const [detectedName, setDetectedName] = useState<string | null>(null)
  const [convertedText, setConvertedText] = useState("")
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<string[][]>([])
  const [columnOrder, setColumnOrder] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Detect delimiter when raw text changes
  useEffect(() => {
    if (!rawText.trim()) {
      setDetectedName(null)
      setConvertedText("")
      setHeaders([])
      setRows([])
      setColumnOrder([])
      return
    }

    const controller = new AbortController()
    detectDelimiter({ text: rawText })
      .then((res) => {
        if (controller.signal.aborted) return
        setFromDelimiter(res.delimiter)
        setDetectedName(res.delimiterName)
      })
      .catch((err) => {
        if (!controller.signal.aborted) toast.error(err.message)
      })

    return () => controller.abort()
  }, [rawText])

  // Convert when inputs change (debounced)
  const doConvert = useCallback(() => {
    if (!rawText.trim()) return

    setLoading(true)
    convertDelimiter({
      text: rawText,
      fromDelimiter,
      toDelimiter,
      columnOrder: columnOrder.length > 0 ? columnOrder : undefined,
    })
      .then((res) => {
        setConvertedText(res.convertedText)
        setHeaders(res.headers)
        setRows(res.rows)
        // Initialize column order if not set
        if (columnOrder.length === 0 && res.headers.length > 0) {
          setColumnOrder(res.headers.map((_: string, i: number) => i))
        }
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [rawText, fromDelimiter, toDelimiter, columnOrder])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(doConvert, 300)
    return () => clearTimeout(debounceRef.current)
  }, [doConvert])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Unlimiter</h1>
          <p className="text-muted-foreground">Convert between delimited text formats</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileInput
              rawText={rawText}
              onTextChange={setRawText}
              detectedDelimiter={detectedName}
            />
            <DelimiterPicker
              fromDelimiter={fromDelimiter}
              toDelimiter={toDelimiter}
              onFromChange={setFromDelimiter}
              onToChange={setToDelimiter}
            />
          </CardContent>
        </Card>

        {headers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Columns</CardTitle>
            </CardHeader>
            <CardContent>
              <ColumnReorder
                headers={headers}
                columnOrder={columnOrder}
                onColumnOrderChange={setColumnOrder}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Output
                {loading && <span className="ml-2 text-sm font-normal text-muted-foreground">Converting...</span>}
              </CardTitle>
              <DownloadButton convertedText={convertedText} toDelimiter={toDelimiter} />
            </div>
          </CardHeader>
          <CardContent>
            <Preview convertedText={convertedText} headers={headers} rows={rows} />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}
