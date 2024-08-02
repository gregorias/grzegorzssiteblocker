// A single rule that blocks a URL specified by its pattern.
export class Rule {
  // A unique ID.
  // This makes rules into entities that can be tracked in UI.
  id: number;
  enabled: boolean = false;
  pattern: string = "";

  constructor(id: number, enabled: boolean, pattern: string) {
    this.id = id;
    this.enabled = enabled;
    this.pattern = pattern;
  }

  /**
   * Clones this rule.
   *
   * @returns A clone of this rule.
   */
  clone(): Rule {
    return new Rule(this.id, this.enabled, this.pattern);
  }

  /**
   * Serializes this rule.
   *
   * @returns The serialized rule.
   */
  serialize(): object {
    return {
      id: this.id,
      enabled: this.enabled,
      pattern: this.pattern,
    };
  }

  /**
   * Deserializes a rule.
   *
   * @returns The deserialized rule.
   */
  static deserialize(data: any | [string, boolean]): Rule {
    if (data instanceof Array) {
      // A legacy format of an array of [pattern, enabled].
      return new Rule(generateRuleId(), data[1], data[0]);
    } else {
      return new Rule(data["id"], data["enabled"], data["pattern"]);
    }
  }
}

/**
 * Generates a new rule ID.
 */
export function generateRuleId(): number {
  return Math.floor(Math.random() * 1000000);
}
