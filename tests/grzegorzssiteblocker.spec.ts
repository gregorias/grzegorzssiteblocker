import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("options page opens up", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);
});

test("correct rules still block event if there are incorrect patterns", async ({
  page,
  extensionId,
}) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);
  await page.getByText("Add").click();
  await page.getByText("Add").click();
  await page.locator('input[type="text"]').nth(0).fill("[aasdf");
  await page.getByRole("checkbox").nth(0).click();
  await page.locator('input[type="text"]').nth(1).click();
  await page.locator('input[type="text"]').nth(1).fill("google");
  await page.getByRole("checkbox").nth(1).click();

  try {
    await page.goto("https://google.com");
    expect(false).toBeTruthy();
  } catch (e) {
    expect(e.message).toContain(
      "page.goto: net::ERR_BLOCKED_BY_CLIENT at https://google.com/",
    );
  }
});
