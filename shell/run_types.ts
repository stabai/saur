export type RunType = 'piped' | 'streamed';

interface ExtensionRunOptionsExtension {
  throwOnError?: boolean;
}

export type FullRunOptions = Deno.RunOptions & ExtensionRunOptionsExtension;

type OmittedUserRunOptionKeys = "cmd" | "stdout" | "stderr" | "stdin";
export type UserRunOptions = Omit<FullRunOptions, OmittedUserRunOptionKeys>;

type OmittedUserTryOptionKeys = "throwOnError";
export type UserTryOptions = Omit<UserRunOptions, OmittedUserTryOptionKeys>;

export interface ProcessResult {
  status: Deno.ProcessStatus;
}
export interface PipedProcessResult extends ProcessResult {
  status: Deno.ProcessStatus;
  stdout: string;
  stderr: string;
}

export function isPiped(result: ProcessResult): result is PipedProcessResult {
  return 'stdout' in result;
}
