import React, { useEffect, useState } from "react";

import { Rule } from "./rule";
import { RuleList } from "./RuleList";
import { storage } from "./storage";

interface OptionsPageProps {}

// The page component for the options page.
//
// This basically just wraps the RuleList component, and handles the state.
export function OptionsPage(_props: OptionsPageProps): React.ReactElement {
  // The source of truth is actually in the storage module. This state is here
  // to introduce it to React’s state management.
  const [rules, setRules] = useState<Rule[]>([]);

  // TODO: Show a spinner until the rules are loaded.
  useEffect(() => {
    let cancelled: boolean = false;
    (async function () {
      try {
        let initialRules = await storage.getRules();
        if (cancelled) return;
        setRules(initialRules);
      } catch (e) {
        if (cancelled) return;
        setRules([]);
      }
      return () => {
        cancelled = true;
      };
    })();
  }, []);

  useEffect(() => {
    storage.addListener(setRules);
    // TODO: Unsubscribe from the listener when the component is unmounted.
  }, []);

  return (
    <>
      <RuleList
        rules={rules}
        onRulesChange={storage.setRules}
        onAddRule={() => {
          storage.setRules([...rules, new Rule(false, "")]);
        }}
      />
      ,
    </>
  );
}
