export function checkExhaustive<T = unknown>(value: never): T {
  throw new Error(`Non-exhaustive check did not handle ${value}`);
}
