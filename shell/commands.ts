import { $ } from './run.ts';

export function commandExists(command: string): Promise<boolean> {
  const script = Deno.build.os === 'windows' ? `Get-Command "${command}"` : `command -v "${command}"`;
  return $.try(script);
}
