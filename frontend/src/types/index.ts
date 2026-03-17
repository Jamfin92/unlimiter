export interface DetectRequest {
  text: string
}

export interface DetectResponse {
  delimiter: string
  delimiterName: string
}

export interface ConvertRequest {
  text: string
  fromDelimiter: string
  toDelimiter: string
  columnOrder?: number[]
}

export interface ConvertResponse {
  convertedText: string
  rows: string[][]
  headers: string[]
}

export interface DelimiterOption {
  value: string
  label: string
}

export const DELIMITER_OPTIONS: DelimiterOption[] = [
  { value: ",", label: "Comma" },
  { value: " ", label: "Space" },
  { value: "\t", label: "Tab" },
  { value: ";", label: "Semicolon" },
]
