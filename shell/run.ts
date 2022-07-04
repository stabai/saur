import { ProcessError } from './process_error.ts';
import {
  FullRunOptions,
  FullUserRunOptions,
  PipedProcessResult,
  ProcessResult,
  UserRunOptions,
  UserTryOptions,
} from './run_types.ts';

interface PipedRunOptions extends FullRunOptions {
  stdout: 'piped';
  stderr: 'piped';
}

export async function $(
  command: string | string[],
  options: FullUserRunOptions = {},
): Promise<string> {
  const result = await runPiped(buildCommandArray(command), options);
  return result.stdout;
}

$.run = runGeneric;
$.piped = runPiped;
$.streamed = runStreamed;
$.try = tryRun;

async function tryRun(
  command: string[] | string,
  options: UserTryOptions = {},
): Promise<boolean> {
  const result = await runPiped(command, { ...options, throwOnError: false });
  return result.status.success;
}

function runStreamed(
  command: string[] | string,
  options: UserRunOptions = {},
): Promise<ProcessResult> {
  const fullOptions: FullRunOptions = {
    cmd: buildCommandArray(command),
    stdout: 'inherit',
    stderr: 'inherit',
    ...options,
  };
  return runInternal(fullOptions);
}

function runPiped(
  command: string[] | string,
  options: UserRunOptions = {},
): Promise<PipedProcessResult> {
  const fullOptions: PipedRunOptions = {
    cmd: buildCommandArray(command),
    stdout: 'piped',
    stderr: 'piped',
    ...options,
  };
  return runInternal(fullOptions);
}

function runGeneric(
  command: string[] | string,
  options: FullUserRunOptions = {},
): Promise<ProcessResult> {
  const fullOptions: FullRunOptions = {
    cmd: buildCommandArray(command),
    ...options,
  };
  return runInternal(fullOptions);
}

function runInternal(options: PipedRunOptions): Promise<PipedProcessResult>;
function runInternal(options: FullRunOptions): Promise<ProcessResult>;
async function runInternal(options: FullRunOptions): Promise<ProcessResult> {
  const proc = Deno.run(options);

  const isPiped = options.stdout === 'piped';
  const stdoutPromise = isPiped ? proc.output() : Promise.resolve(undefined);
  const stderrPromise = isPiped ? proc.stderrOutput() : Promise.resolve(undefined);

  const [status, stdout, stderr] = await Promise.all([
    proc.status(),
    stdoutPromise,
    stderrPromise,
  ]);

  const result: ProcessResult = { status };
  if (isPiped) {
    const decoder = new TextDecoder();
    const pipedResult = result as PipedProcessResult;
    pipedResult.stdout = decoder.decode(stdout);
    pipedResult.stderr = decoder.decode(stderr);
  }
  proc.close();

  if (result.status.success || options.throwOnError === false) {
    return result;
  } else {
    throw new ProcessError(result);
  }
}

function buildCommandArray(command: string | string[]): string[] {
  if (Array.isArray(command)) {
    return command;
  } else if (Deno.build.os === 'windows') {
    return ['PowerShell.exe', '-Command', command];
  } else {
    return [Deno.env.get('SHELL') ?? '/bin/bash', '-c', command];
  }
}
