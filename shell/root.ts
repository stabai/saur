import { $ } from './run.ts';

export async function isRoot(): Promise<boolean> {
  if (Deno.build.os === 'windows') {
    throw new Error('Root detection not implemented for Windows.');
  }
  const result = await $(['id', '-u']);
  return result === '0';
}
