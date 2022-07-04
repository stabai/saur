export type Awaitable<T> = T | Promise<T>;

export type PromiseRecord<T> = {
  [P in keyof T]: Awaitable<T[P]>;
};

export async function resolvePromiseRecord<T>(record: PromiseRecord<T>): Promise<T> {
  const awaited: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    awaited[key] = await value;
  }
  return awaited as T;
}
