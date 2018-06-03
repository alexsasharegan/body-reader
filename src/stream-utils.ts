import { IncomingMessage } from "http";

export interface ReadableHandler {
  data(chunk: string | Buffer): void;
  end(): void;
  error(err: Error): void;
  aborted?(): void;
  close?(): void;
}

export function mapStreamEvents(rx: IncomingMessage, handler: ReadableHandler) {
  rx.on("data", handler.data);
  rx.on("end", handler.end);
  rx.on("error", handler.error);
  rx.on("close", handler.close || noop);
  rx.on("aborted", handler.aborted || noop);
}

export function noop() {}
