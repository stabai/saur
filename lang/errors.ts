export type LoggingFunction = (...data: unknown[]) => void;

export async function nonExplosively<T>(fn: () => Promise<T>): Promise<T | Error> {
  try {
    return await fn();
  } catch (err) {
    return err;
  }
}

export async function catchErrorsAsWarnings(
  fn: (...args: unknown[]) => Promise<unknown>,
  logger: LoggingFunction = console.warn,
): Promise<boolean> {
  try {
    await fn();
    return false;
  } catch (err) {
    logger(err);
    return true;
  }
}
