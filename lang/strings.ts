import { isNil } from "https://raw.githubusercontent.com/stabai/saur/main/lang/values.ts";

export interface FormattingPattern {
  pattern: string;
}

export type BuildableString = FormattingPattern | string;

export function formatString(patternOrString: BuildableString, contextVariables: Record<string, string> = {}): string {
  if (typeof patternOrString === 'string') {
    return patternOrString;
  }
  const builder = [];
  let last: string | undefined;
  let inVariable = false;
  let variableName = '';
  for (const c of patternOrString.pattern) {
    let handled = false;
    if (inVariable) {
      switch (c) {
        case '}': {
          inVariable = false;
          handled = true;
          const value = contextVariables[variableName];
          if (isNil(value)) {
            throw new Error(`Unknown context variable in pattern: ${variableName}`);
          } else {
            builder.push(value);
          }
          break;
        }
        default:
          variableName += c;
          handled = true;
          break;
      }
    } else if (last === '$') {
      switch (c) {
        case '$':
          builder.push('$');
          handled = true;
          break;
        case '{':
          variableName = '';
          inVariable = true;
          handled = true;
          break;
        default:
          throw new Error(`Illegal pattern: "${patternOrString}"`);
      }
    }
    if (handled) {
      last = undefined;
    } else {
      last = c;
      if (c !== '$') {
        builder.push(c);
      }
    }
  }
  if (inVariable) {
    throw new Error(`Unfinished variable in pattern: ${variableName}`);
  }
  return builder.join('');
}
