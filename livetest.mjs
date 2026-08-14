import { chromium } from "playwright";

const base = "https://chanthasreyneang.github.io/miss-sunflower-brand";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (err) => errors.push("PAGEERROR: " + err.message));
page.on("console", (msg) => { if (msg.type() === "error") errors.push("CONSOLE: " + msg.text()); });
function logErrors(label) {
  console.log(`--- ${label}: ${errors.length ? errors.join(" | ") : "no errors"}`);
  errors.length = 0;
}

// 1. Home page
await page.goto(base + "/", { waitUntil: "load" });
await page.waitForTimeout(2000);
console.log("Hero rendered?", Boolean(await page.$(".hero-content h1")));
console.log("Navbar rendered?", Boolean(await page.$(".navbar-brand")));
logErrors("live home page");
await page.screenshot({ path: "live-home.png" });

// 2. Client-side nav to Shop
await page.click('a:has-text("Shop")');
await page.waitForTimeout(1500);
console.log("URL after client nav:", page.url());
logErrors("client nav to shop");

// 3. Direct navigation (hard reload) to /products - the real 404-trick test
await page.goto(base + "/products", { waitUntil: "load" });
await page.waitForTimeout(2000);
console.log("URL after direct nav to /products:", page.url());
console.log("Products heading rendered?", Boolean(await page.$('h1:has-text("Our Products")')));
logErrors("direct nav to /products");
await page.screenshot({ path: "live-products.png" });

// 4. Direct nav to /login
await page.goto(base + "/login", { waitUntil: "load" });
await page.waitForTimeout(1500);
console.log("URL after direct nav to /login:", page.url());
console.log("Login form rendered?", Boolean(await page.$('input[placeholder="Enter email"]')));
logErrors("direct nav to /login");

await browser.close();
console.log("DONE");
