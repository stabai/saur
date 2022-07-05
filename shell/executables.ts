import { $ } from './run.ts';

export async function makeFileExecutable(executablePath: string): Promise<void> {
  if (Deno.build.os === 'windows') {
    // This concept doesn't translate to windows (file just needs to have the appropriate extension)
    return;
  }

  const promises: Promise<unknown>[] = [];
  promises.push($(['chmod', '+x', executablePath]));
  if (Deno.build.os === 'darwin') {
    // Use try so that this is a best effort operation
    promises.push($.try(['xattr', '-d', 'com.apple.quarantine', executablePath]));
  }
  await Promise.all(promises);
}
