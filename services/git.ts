import { $ } from 'https://raw.githubusercontent.com/stabai/saur/main/shell/run.ts';
import { FullRunOptions, RunType } from 'https://raw.githubusercontent.com/stabai/saur/main/shell/run_types.ts';
import { isEmpty, isNil } from '../lang/values.ts';
import { FullUserRunOptions } from '../shell/run_types.ts';

export interface GitCommandOptions {
  workingDirectory?: string;
  output?: RunType;
}

export interface GitCommitsBehindOriginOptions extends GitCommandOptions {
  mainBranch?: string;
}

function gitOptionsToRunOptions(gitOptions: GitCommandOptions | undefined): Omit<FullRunOptions, 'cmd'> {
  const runOptions: FullUserRunOptions = {};
  if (isNil(gitOptions)) {
    return runOptions;
  }
  if (!isEmpty(gitOptions.workingDirectory)) {
    runOptions.cwd = gitOptions.workingDirectory;
  }
  if (gitOptions.output === 'streamed') {
    runOptions.stdout = 'inherit';
    runOptions.stderr = 'inherit';
  } else {
    runOptions.stdout = 'piped';
    runOptions.stderr = 'piped';
  }
  return runOptions;
}

export async function pull(options?: GitCommandOptions): Promise<void> {
  await $(['git', 'pull'], gitOptionsToRunOptions(options));
}

export async function currentBranch(options?: GitCommandOptions): Promise<string> {
  const result = await $(['git', 'branch', '--show-current'], gitOptionsToRunOptions(options));
  return result.trim();
}

export async function commitsBehindOrigin(options?: GitCommitsBehindOriginOptions): Promise<number> {
  const localBranch = await currentBranch();
  const mainBranch = options?.mainBranch ?? localBranch;
  const behindOutput = await $(
    ['git', 'rev-list', '--count', '--left-right', `origin/${mainBranch}...${localBranch}`],
    gitOptionsToRunOptions(options),
  );
  const behindCountMatch = /^[0-9]+/.exec(behindOutput);
  if (isEmpty(behindCountMatch)) {
    throw new Error(`Unexpected output to git rev-list: ${behindOutput}`);
  }
  return Number(behindCountMatch[0]);
}
