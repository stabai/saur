import { assertNotEquals, assertRejects } from 'https://deno.land/std@0.144.0/testing/asserts.ts';
import { $ } from './run.ts';

Deno.test('executables on path can run', async () => {
  const output = await $(['deno', '--version']);
  assertNotEquals(output, '');
});

Deno.test('script statements can run', async () => {
  const output = await $('deno --version');
  assertNotEquals(output, '');
});

Deno.test('built-in commands can run in script statements', async () => {
  const cmd = Deno.build.os === 'windows' ? 'Get-Command "Get-Command"' : 'command -v "command"';
  const output = await $(cmd);
  assertNotEquals(output, '');
});

Deno.test('failed commands throw', () => {
  assertRejects(() => $(['unknownillegalcommand']));
});
