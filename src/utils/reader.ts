import { Readable } from "stream"

import { reader } from "../constants/reader"

export function readCsvStream<P>(stream: Readable): Promise<P> {
  return reader.csv.readStream(stream)
}

export function readCsvFile<P>(path: string): Promise<P> {
  return reader.csv.readFile(path)
}

export function readCsvBuffer<P>(context: Buffer): P {
  return reader.csv.readBuffer(context)
}

export function readCsvString<P>(context: string): P {
  return reader.csv.readString(context)
}
