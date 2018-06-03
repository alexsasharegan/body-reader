import { Option } from "safe-types";

export interface HttpErrorLike {
  name: string;
  message: string;
  code: number;
  stack: string[];
}

export class HttpError extends Error {
  constructor(public message: string, public code: number = 500) {
    super(message);
  }

  toJSON(): HttpErrorLike {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stack: Option.of(this.stack).map_or([], stack => stack.split("\n")),
    };
  }

  static from(err: Error, code?: number): HttpError {
    let httpErr = new HttpError(err.message, code);
    httpErr.stack = err.stack;
    httpErr.name = err.name;

    return httpErr;
  }
}
