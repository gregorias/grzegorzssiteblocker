import React, { useEffect } from "react";

import { isRegexpValid } from "./regexp";
import { Rule } from "./rule";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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

  // Don’t use `value` as this is not a controlled component.
  // https://github.com/gregorias/grzegorzssiteblocker/issues/3.
  return (
    <div className="rule">
      <Checkbox
        checked={props.rule.enabled}
        onChange={(e) => {
          props.onRuleChange(new Rule(e.target.checked, props.rule.pattern));
        }}
      />
      <div className="rule--pattern">
        <TextField
          placeholder="facebook.com"
          variant="standard"
          defaultValue={props.rule.pattern}
          inputProps={{
            autoCorrect: "off",
          }}
          classes={{ root: "pattern" }}
          error={!isPatternValid}
          helperText={
            !isPatternValid ? "Enter a valid regular expression" : undefined
          }
          onChange={(e) => {
            props.onRuleChange(new Rule(props.rule.enabled, e.target.value));
          }}
        />
      </div>
      <Button onClick={props.onDelete} variant="outlined">
        Delete
      </Button>
    </div>
  );
}
