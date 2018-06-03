import { toBytes } from "fmt-bytes";

export interface ReadOptions {
  /**
   * Maximum allowable bytes to read.
   */
  limit?: number;
  /**
   * Charset used to encode byte buffer to a string.
   * @default 'utf8'
   */
  encoding?: string;
}

export const defaultLimit = toBytes(100, "KiB");
export const defaultEncoding = "utf8";
