import React from "react";

import { Rule } from "./rule";
import { RuleElement } from "./RuleElement";
import Button from "@mui/material/Button/Button";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

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
            key={rule.id}
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
      <div className="add">
        <Button
          onClick={props.onAddRule}
          variant="contained"
          fullWidth={true}
          endIcon={<AddCircleOutlineRoundedIcon />}
        >
          Add
        </Button>
      </div>
    </>
  );
}
