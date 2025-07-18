import React, { useEffect, useState } from "react";

import { createTheme } from "./theme";
import { Rule, generateRuleId } from "./rule";
import { RuleList } from "./RuleList";
import { storage } from "./storage";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface OptionsPageProps {}

// The page component for the options page.
//
// This basically just wraps the RuleList component, and handles the state.
export function OptionsPage(_props: OptionsPageProps): React.ReactElement {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(
    () => createTheme(prefersDarkMode),
    [prefersDarkMode],
  );

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
    () => {
      storage.removeListener(setRules);
    };
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <RuleList
          rules={rules}
          onRulesChange={storage.setRules}
          onAddRule={() => {
            let newRule = new Rule(generateRuleId(), false, "");
            storage.setRules([...rules, newRule]);
          }}
        />
      </ThemeProvider>
    </>
  );
}
