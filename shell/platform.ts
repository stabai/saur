import { EOL } from 'https://deno.land/std@0.137.0/fs/eol.ts';

export type OsType = typeof Deno.build.os;

export const SYSTEM_EOL = Deno.build.os === 'windows' ? EOL.CRLF : EOL.LF;
