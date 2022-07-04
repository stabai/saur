import { basename } from 'https://deno.land/std@0.145.0/path/mod.ts';
import { ensureDir } from 'https://deno.land/std@0.145.0/fs/mod.ts';
import { Destination, download } from 'https://deno.land/x/download@v1.0.1/mod.ts';
import * as path from 'https://deno.land/std@0.145.0/path/mod.ts';
import { isNil } from '../lang/values.ts';

export async function downloadFileTo(fileUrl: string, downloadDirectory?: string): Promise<string> {
  const destination: Destination = { file: basename(fileUrl) };
  if (!isNil(downloadDirectory)) {
    await ensureDir(downloadDirectory);
    destination.dir = path.resolve(downloadDirectory);
  }
  const result = await download(fileUrl, destination);
  return result.fullPath;
}
