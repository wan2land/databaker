import { Readable } from "stream"

export interface Image {
  save(filename: string): Promise<void>
  show(): Promise<void>
  stream(): Readable
}
