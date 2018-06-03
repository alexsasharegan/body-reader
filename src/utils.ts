import { Option } from "safe-types";

export function parseIntOr(def: number, x: string | undefined): number {
  return Option.of(x)
    .map(num => parseInt(num, 10))
    .filter(Number.isInteger)
    .unwrap_or(def);
}
