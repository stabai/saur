export async function readUrlAsText(fileUrl: string): Promise<string> {
  const result = await fetch(fileUrl);
  return result.text();
}

export async function readUrlAsJson<T = Record<string | number | symbol, unknown>>(fileUrl: string): Promise<T> {
  const result = await fetch(fileUrl);
  return result.json();
}
