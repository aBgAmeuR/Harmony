import { chromium, expect, type FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
	const { baseURL } = config.projects[0].use;
	const browser = await chromium.launch();
	const page = await browser.newPage();

	await page.goto(baseURL!);

	await page.getByRole("button", { name: "Get a demo of Harmony" }).click();

	await expect(page.getByText("Exit demo")).toBeVisible();

	await page
		.context()
		.storageState({ path: "packages/web-tests/.auth/user.json" });

	await browser.close();
}

export default globalSetup;
