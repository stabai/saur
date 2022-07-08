export function isNil(value: unknown): value is null | undefined {
  return value == null;
}
export function isEmpty(value: unknown): value is null | undefined {
  if (isNil(value)) {
    return true;
  } else if (value === '') {
    return true;
  } else if (typeof value === 'object') {
    const keys = Object.keys(value!);
    if (keys.length === 0) {
      return true;
    } else {
      const record = value as Record<string, unknown>;
      return record.length === 0 || record.size === 0;
    }
  }
  return false;
}

export function isNilOr<T>(value: T | null | undefined, defaultValue: T): value is null | undefined {
  return isNil(value) || value === defaultValue;
}
