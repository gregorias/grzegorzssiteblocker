import React, { useState } from "react";

import { Rule } from "./rule";
import { RuleElement } from "./RuleElement";

interface RuleListProps {
  rules: Array<Rule>;
  onRulesChange(newRules: Rule[]): void;
  onAddRule(): void;
}

export function RuleList(props: RuleListProps): React.ReactElement {
  return (
    <>
      {props.rules.map((rule, index) => {
        return (
          <RuleElement
            key={index}
            rule={rule}
            onRuleChange={(newRule: Rule) => {
              let newRules = [...props.rules];
              newRules.splice(index, 1, newRule);
              props.onRulesChange(newRules);
            }}
            onDelete={() => {
              let newRules = [...props.rules];
              newRules.splice(index, 1);
              props.onRulesChange(newRules);
            }}
          />
        );
      })}
      <button onClick={props.onAddRule}>Add</button>
    </>
  );
}
