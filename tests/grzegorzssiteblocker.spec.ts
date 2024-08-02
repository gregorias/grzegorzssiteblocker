import { expect } from "@playwright/test";
import { test } from "./fixtures";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

// https://github.com/gregorias/grzegorzssiteblocker/issues/4
test("deleting a rule in the middle unblocks the pattern", async ({
  page,
  extensionId,
}) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);
  await page.getByText("Add").click();
  await page.getByText("Add").click();
  await page.getByText("Add").click();
  await page.locator('input[type="text"]').nth(0).fill("facebook");
  await page.getByRole("checkbox").nth(0).click();
  await page.locator('input[type="text"]').nth(1).click();
  await page.locator('input[type="text"]').nth(1).fill("google");
  await page.getByRole("checkbox").nth(1).click();
  await page.locator('input[type="text"]').nth(2).click();
  await page.locator('input[type="text"]').nth(2).fill("bing");
  await page.getByRole("checkbox").nth(2).click();

  //try {
  //  await page.goto("https://google.com");
  //  expect(false).toBeTruthy();
  //} catch (e) {
  //  expect(e.message).toContain(
  //    "page.goto: net::ERR_BLOCKED_BY_CLIENT at https://google.com/",
  //  );
  //}

  await page.goto(`chrome-extension://${extensionId}/options.html`);
  await page.getByText("Delete").nth(1).click();
  // Let the asynchronous rules update.
  // This is not the best way to do this (would be great to wait for a spinner
  // or something), but it’s the simplest.
  await sleep(100);

  await page.goto("https://google.com");
});
