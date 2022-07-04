import { crypto } from 'https://deno.land/std@0.145.0/crypto/mod.ts';
import * as hex from 'https://deno.land/std@0.145.0/encoding/hex.ts';
import { DigestAlgorithm } from 'https://deno.land/std@0.145.0/_wasm_crypto/mod.ts';

export async function hashFile(filePath: string, algorithm: DigestAlgorithm = 'SHA-256'): Promise<string> {
  const fileBytes = await Deno.readFile(filePath);
  const hash = new Uint8Array(
    await crypto.subtle.digest(
      algorithm,
      fileBytes,
    ),
  );
  return hex.encode(hash).toString();
}
