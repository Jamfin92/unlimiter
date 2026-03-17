import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface PreviewProps {
  convertedText: string
  headers: string[]
  rows: string[][]
}

export function Preview({ convertedText, headers, rows }: PreviewProps) {
  const [tab, setTab] = useState("table")

  if (!convertedText) return null

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Output Preview</label>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <div className="overflow-auto rounded-md border max-h-80">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {headers.map((h, i) => (
                    <th key={i} className="px-3 py-2 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className="border-b last:border-0">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-1.5 whitespace-nowrap">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="raw">
          <Textarea value={convertedText} readOnly rows={10} className="font-mono text-sm" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
