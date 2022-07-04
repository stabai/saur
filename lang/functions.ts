import { isNil } from './values.ts';

export type InputlessFn<R> = () => R;
export type ParameterizedFn<P, R> = (args: P) => R;

export function memoized<R>(fn: InputlessFn<R>): InputlessFn<R> {
  let value: R | undefined;
  return () => {
    if (value === undefined) {
      value = fn();
    }
    return value as R;
  };
}

export function cached<P, R>(fn: ParameterizedFn<P, R>): ParameterizedFn<P, R> {
  const cache = new Map<string, R>();
  return (args: P) => {
    const cacheKey = JSON.stringify(args);
    let value = cache.get(cacheKey);
    if (isNil(value)) {
      value = fn(args);
      cache.set(cacheKey, value);
    }
    return value;
  };
}

export function toSelf<T>() {
  return (value: T) => value;
}
export function to<T>(value: T) {
  return () => value;
}
export function toVoid(): () => void {
  return () => {};
}
export function toJson<T>(): (value: T) => string {
  return JSON.stringify;
}
export function fromJson<T>(): (value: string) => T {
  return JSON.parse;
}
