import { ensureDir, ensureFile } from 'https://deno.land/std@0.145.0/fs/mod.ts';
import { Untar } from 'https://deno.land/std@0.145.0/archive/tar.ts';
import * as zip from 'https://deno.land/x/zip@v1.2.3/mod.ts';
import * as path from 'https://deno.land/std@0.145.0/path/mod.ts';
import * as streamConversion from 'https://deno.land/std@0.145.0/streams/conversion.ts';

export type ArchiveFormat = 'tar' | 'zip';

export async function extractArchive(
  archiveFormat: ArchiveFormat,
  archiveFilePath: string,
  destinationFolder: string,
): Promise<string> {
  await ensureDir(destinationFolder);
  switch (archiveFormat) {
    case 'tar': {
      return await extractTar(archiveFilePath, destinationFolder);
    }
    case 'zip': {
      const result = await zip.decompress(archiveFilePath, destinationFolder);
      if (result === false) {
        throw new Error(`Unzip of ${archiveFilePath} failed`);
      } else {
        return result;
      }
    }
  }
}

async function extractTar(archiveFilePath: string, destinationFolder: string): Promise<string> {
  const reader = await Deno.open(archiveFilePath, { read: true });
  try {
    const untar = new Untar(reader);
    for await (const entry of untar) {
      const fileName = path.join(destinationFolder, entry.fileName);
      if (entry.type === 'directory') {
        await ensureDir(fileName);
        continue;
      }
      await ensureFile(fileName);
      const file = await Deno.open(fileName, { write: true });
      await streamConversion.copy(entry, file);
    }
    return destinationFolder;
  } finally {
    reader.close();
  }
}
