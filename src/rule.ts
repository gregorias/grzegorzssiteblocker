// A single rule that blocks a URL specified by its pattern.
export class Rule {
  enabled: boolean = false;
  pattern: string = "";
  constructor(enabled: boolean, pattern: string) {
    this.enabled = enabled;
    this.pattern = pattern;
  }
}
