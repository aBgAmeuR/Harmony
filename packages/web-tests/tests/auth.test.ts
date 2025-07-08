import { expect, test } from "@playwright/test";

test("should be logged in with demo account", async ({ page }) => {
	await page.goto("/overview");

	await expect(page.getByText("Active Listeners").first()).toBeVisible();
});

test("can navigate to different pages while authenticated", async ({
	page,
}) => {
	await page.goto("/rankings/tracks");
	await expect(page.getByText("Let It Go").first()).toBeVisible();

	await page.goto("/rankings/albums");
	await expect(page.getByText("Whole Lotta Red").first()).toBeVisible();

	await page.goto("/rankings/artists");
	await expect(page.getByText("Playboi Carti").first()).toBeVisible();

	await page.goto("/stats/activity");
	await expect(
		page.getByText("Time Listened Over Months").first(),
	).toBeVisible();
});

test("demo logout functionality", async ({ page }) => {
	await page.goto("/overview");

	await page.getByRole("button", { name: "Exit Demo" }).click();

	await expect(page.getByText("You are in a demo")).toBeVisible();
});
