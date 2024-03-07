import React, { useEffect } from "react";

import { isRegexpValid } from "./regexp";
import { Rule } from "./rule";

interface RuleElementProps {
  rule: Rule;
  onRuleChange: (newRule: Rule) => void;
  onDelete: () => void;
}

export function RuleElement(props: RuleElementProps): React.ReactElement {
  const [isPatternValid, setIsPatternValid] = React.useState(false);

  useEffect(() => {
    let cancelled = false;
    (async function () {
      const result = await isRegexpValid(props.rule.pattern);
      if (cancelled) return;
      setIsPatternValid(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [props.rule.pattern]);

  return (
    <div className="rule">
      <input
        type="checkbox"
        title="If checked, the extension blocks this pattern."
        checked={props.rule.enabled}
        onChange={(e) => {
          props.onRuleChange(new Rule(e.target.checked, props.rule.pattern));
        }}
      ></input>
      <input
        type="text"
        className={"pattern" + (isPatternValid ? "" : " incorrect")}
        title="The pattern to block."
        value={props.rule.pattern}
        onChange={(e) => {
          props.onRuleChange(new Rule(props.rule.enabled, e.target.value));
        }}
      ></input>
      <button onClick={props.onDelete}>Delete</button>
    </div>
  );
}
