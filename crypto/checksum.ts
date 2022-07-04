import * as path from 'https://deno.land/std@0.145.0/path/mod.ts';
import { hashFile } from './hash.ts';

export interface ChecksumFileEntry {
  filePath: string;
  expectedHash: string;
}

export function readChecksumFile(contents: string): ChecksumFileEntry[] {
  const lines = contents.split('\n');
  const entries: ChecksumFileEntry[] = [];
  for (const line of lines) {
    const [filePath, expectedHash] = line.split('  ');
    if (filePath.length > 0 && expectedHash.length > 0) {
      entries.push({ filePath, expectedHash });
    }
  }
  return entries;
}

export async function verifyChecksumFile(checksums: ChecksumFileEntry[], directory = Deno.cwd()): Promise<void> {
  for (const entry of checksums) {
    const filePath = path.join(directory, entry.filePath);
    await verifyChecksumHash(filePath, entry.expectedHash);
  }
}

export async function verifyChecksumHash(filePath: string, expectedHash: string): Promise<void> {
  const actualHash = await hashFile(filePath);
  if (actualHash !== expectedHash) {
    const fileBaseName = path.basename(filePath);
    throw new Error(
      `Checksum for '${fileBaseName}' did not match.\nExpected: ${expectedHash}\nActual:   ${actualHash}`,
    );
  }
}
