import { fromFileUrl } from 'https://deno.land/std@0.145.0/path/mod.ts';
import { $ } from './run.ts';

export async function restartScript(mainScriptImportMeta: ImportMeta): Promise<void> {
  const mainScriptPath = fromFileUrl(mainScriptImportMeta.url);
  const rerun = await $.streamed(['deno', 'run', '--allow-all', mainScriptPath, '--', ...Deno.args]);
  Deno.exit(rerun.status.code);
}
