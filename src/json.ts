import { IncomingMessage } from "http";
import { mapStreamEvents } from "./stream-utils";
import { ReadOptions, defaultLimit, defaultEncoding } from "./options";
import { HttpError, HttpErrorLike } from "./error";
import { parseIntOr } from "./utils";
import { Result, Err, Ok } from "safe-types";

export function read<T = any>(
  rx: IncomingMessage,
  callback: (result: Result<T, HttpError | HttpErrorLike>) => void
): void;
export function read<T = any>(
  rx: IncomingMessage,
  options: ReadOptions,
  callback: (result: Result<T, HttpError | HttpErrorLike>) => void
): void;
export function read<T = any>(): void {
  let rx: IncomingMessage;
  let limit = defaultLimit;
  let encoding = defaultEncoding;
  let callback: (result: Result<T, HttpError | HttpErrorLike>) => void;

  switch (arguments.length) {
    case 3:
      rx = arguments[0];
      encoding = arguments[1].encoding || encoding;
      limit = arguments[1].limit || limit;
      callback = arguments[2];
      break;

    case 2:
      rx = arguments[0];
      callback = arguments[1];
      break;

    default:
      throw Error(`insufficient arguments`);
  }

  let buf: Buffer[] = [];
  let byteLength = 0;

  let len = parseIntOr(0, rx.headers["content-length"]);
  if (len > limit) {
    callback(Err(new HttpError(`request entity too large`, 413)));
    return;
  }

  if (len == 0) {
    callback(Ok(<any>{}));
    return;
  }

  mapStreamEvents(rx, {
    data(chunk) {
      let b = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);

      byteLength += b.byteLength;
      if (byteLength > limit) {
        rx.emit("error", new HttpError(`request entity too large`, 413));
        return;
      }

      buf.push(b);
    },
    end() {
      let bodyBytes = Buffer.concat(buf);
      if (bodyBytes.byteLength > limit) {
        rx.emit("error", new HttpError(`request entity too large`, 413));
        return;
      }

      let str = Buffer.concat(buf).toString(encoding);

      try {
        callback(Ok(JSON.parse(str)));
      } catch (_) {
        callback(Err(new HttpError(`malformed request`, 422)));
      }
    },
    error(err) {
      rx.pause();
      rx.unpipe();

      callback(Err(HttpError.from(err, 500)));
    },
  });
}
