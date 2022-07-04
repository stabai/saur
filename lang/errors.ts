export type LoggingFunction = (...data: unknown[]) => void;

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
