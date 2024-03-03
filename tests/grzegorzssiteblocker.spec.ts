import { test } from "./fixtures";

test("options page", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);
});
