import { test, expect, type Page } from "@playwright/test";

async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

async function seedUser(
  page: Page,
  email: string,
  password: string,
  userId = "test-user-id",
) {
  await page.evaluate(
    ({ email, password, userId }) => {
      const existing = JSON.parse(
        localStorage.getItem("habit-tracker-users") ?? "[]",
      );
      existing.push({
        id: userId,
        email,
        password,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("habit-tracker-users", JSON.stringify(existing));
    },
    { email, password, userId },
  );
}

async function seedSession(page: Page, email: string, userId = "test-user-id") {
  await page.evaluate(
    ({ email, userId }) => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId, email }),
      );
    },
    { email, userId },
  );
}

async function seedHabit(
  page: Page,
  name: string,
  userId = "test-user-id",
  completions: string[] = [],
) {
  await page.evaluate(
    ({ name, userId, completions }) => {
      const existing = JSON.parse(
        localStorage.getItem("habit-tracker-habits") ?? "[]",
      );
      existing.push({
        id: crypto.randomUUID(),
        userId,
        name,
        description: "",
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions,
      });
      localStorage.setItem("habit-tracker-habits", JSON.stringify(existing));
    },
    { name, userId, completions },
  );
}

async function signUpViaUI(page: Page, email: string, password: string) {
  await page.goto("/signup");
  await page.getByTestId("auth-signup-email").fill(email);
  await page.getByTestId("auth-signup-password").fill(password);
  await page.getByTestId("auth-signup-submit").click();
  await page.waitForURL("/dashboard", { timeout: 10000 });
}

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await clearStorage(page);
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await page.waitForURL("/login", { timeout: 10000 });
    expect(page.url()).toContain("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await seedUser(page, "auth@example.com", "password123");
    await seedSession(page, "auth@example.com");

    await page.goto("/");
    await page.waitForURL("/dashboard", { timeout: 10000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("/login", { timeout: 10000 });
    expect(page.url()).toContain("/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.getByTestId("auth-signup-email").fill("newuser@example.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await page.waitForURL("/dashboard", { timeout: 10000 });
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    const session = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("habit-tracker-session") ?? "null"),
    );
    expect(session).not.toBeNull();
    expect(session.email).toBe("newuser@example.com");
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await seedUser(page, "user1@example.com", "password123", "user-1");
    await seedUser(page, "user2@example.com", "password123", "user-2");
    await seedHabit(page, "User One Habit", "user-1");
    await seedHabit(page, "User Two Habit", "user-2");

    await page.goto("/login");
    await page.getByTestId("auth-login-email").fill("user1@example.com");
    await page.getByTestId("auth-login-password").fill("password123");
    await page.getByTestId("auth-login-submit").click();

    await page.waitForURL("/dashboard", { timeout: 10000 });

    await expect(page.getByTestId("habit-card-user-one-habit")).toBeVisible();
    await expect(
      page.getByTestId("habit-card-user-two-habit"),
    ).not.toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await signUpViaUI(page, "creator@example.com", "password123");

    await page.getByTestId("create-habit-button").click();
    await expect(page.getByTestId("habit-form")).toBeVisible();

    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-description-input").fill("Stay hydrated");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await signUpViaUI(page, "streaker@example.com", "password123");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText(
      "0",
    );

    await page.getByTestId("habit-complete-drink-water").click();

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText(
      "1",
    );
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await signUpViaUI(page, "persist@example.com", "password123");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Morning Run");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-morning-run")).toBeVisible();

    await page.reload();
    await page.waitForURL("/dashboard", { timeout: 10000 });

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-morning-run")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await signUpViaUI(page, "logout@example.com", "password123");

    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("/login", { timeout: 10000 });

    expect(page.url()).toContain("/login");

    const session = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("habit-tracker-session") ?? "null"),
    );
    expect(session).toBeNull();
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    await signUpViaUI(page, "offline@example.com", "password123");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    await page.waitForTimeout(3000);

    await context.setOffline(true);

    try {
      await page.goto("/", { waitUntil: "commit", timeout: 10000 });
    } catch {}

    const content = await page.content();
    expect(content).not.toContain("ERR_INTERNET_DISCONNECTED");
    expect(content).not.toContain("This site can't be reached");
    expect(content.length).toBeGreaterThan(100);

    await context.setOffline(false);
  });
});
