import LoginPage from "../../pageobjects/login.page.js";
import InventoryPage from "../../pageobjects/inventory.page.js";
import CartPage from "../../pageobjects/cart.page.js";
import CheckoutPage from "../../pageobjects/checkout.page.js";

const users = {
  standard: { username: "standard_user", password: "secret_sauce" },
  lockedOut: { username: "locked_out_user", password: "secret_sauce" },
};

const products = { slug: "sauce-labs-backpack" };

async function loginAsStandardUser() {
  await LoginPage.open();
  await LoginPage.login(users.standard.username, users.standard.password);
}

describe("Login flow", () => {
  it("should display login page correctly", async () => {
    await LoginPage.open();

    await expect(LoginPage.logo).toHaveText("Swag Labs");
    await expect(LoginPage.usernameInput).toBeDisplayed();
    await expect(LoginPage.passwordInput).toBeDisplayed();
    await expect(LoginPage.loginButton).toBeDisplayed();
  });

  it("should login successfully with valid credentials", async () => {
    await loginAsStandardUser();

    await expect(browser).toHaveUrl(
      expect.stringContaining("/inventory.html")
    );
    await expect(InventoryPage.title).toHaveText("Products");
  });

  it("should show error with invalid credentials", async () => {
    await LoginPage.open();
    await LoginPage.login("wrong_user", "wrong_pass");

    await expect(LoginPage.errorMessage).toBeDisplayed();
    await expect(LoginPage.errorMessage).toHaveText(
      expect.stringContaining("Username and password do not match")
    );
  });

  it("should show error for locked out user", async () => {
    await LoginPage.open();
    await LoginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(LoginPage.errorMessage).toHaveText(
      expect.stringContaining("Sorry, this user has been locked out")
    );
  });

  it("should require username and password", async () => {
    await LoginPage.open();
    await LoginPage.loginButton.click();

    await expect(LoginPage.errorMessage).toBeDisplayed();
  });
});

describe("Shop flow", () => {
  it("should add product to cart", async () => {
    await loginAsStandardUser();

    await InventoryPage.addToCart(products.slug);

    await expect(InventoryPage.cartBadge).toHaveText("1");
  });

  it("should remove product from cart", async () => {
    await loginAsStandardUser();

    await InventoryPage.addToCart(products.slug);
    await InventoryPage.removeFromCart(products.slug);

    await expect(InventoryPage.cartBadge).not.toBeDisplayed();
  });

  it("should continue shopping from cart page", async () => {
    await loginAsStandardUser();

    await InventoryPage.addToCart(products.slug);
    await InventoryPage.goToCart();
    await expect(browser).toHaveUrl(expect.stringContaining("/cart.html"));

    await CartPage.continueShoppingButton.click();
    await expect(browser).toHaveUrl(
      expect.stringContaining("/inventory.html")
    );
  });
});

describe("Sorting flow", () => {
  it("should sort products A-Z", async () => {
    await loginAsStandardUser();

    await InventoryPage.sortBy("az");
    const names = await InventoryPage.getItemNames();

    expect(names.length).toBeGreaterThan(0);
    expect(names).toEqual([...names].sort());
  });

  it("should sort products Z-A", async () => {
    await loginAsStandardUser();

    await InventoryPage.sortBy("za");
    const names = await InventoryPage.getItemNames();

    expect(names).toEqual([...names].sort().reverse());
  });

  it("should sort products by price low to high", async () => {
    await loginAsStandardUser();

    await InventoryPage.sortBy("lohi");
    const prices = await InventoryPage.getItemPrices();

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("should sort products by price high to low", async () => {
    await loginAsStandardUser();

    await InventoryPage.sortBy("hilo");
    const prices = await InventoryPage.getItemPrices();

    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});

describe("Checkout flow", () => {
  it("should complete checkout process", async () => {
    await loginAsStandardUser();

    await InventoryPage.addToCart(products.slug);
    await InventoryPage.goToCart();

    await CartPage.checkout();
    await expect(browser).toHaveUrl(
      expect.stringContaining("/checkout-step-one.html")
    );

    await CheckoutPage.fillCustomerInfo("John", "Doe", "12345");
    await expect(browser).toHaveUrl(
      expect.stringContaining("/checkout-step-two.html")
    );

    await CheckoutPage.finish();
    await expect(browser).toHaveUrl(
      expect.stringContaining("/checkout-complete.html")
    );
    await expect(CheckoutPage.completeHeader).toHaveText(
      "Thank you for your order!"
    );
  });

  it("should require postal code to proceed", async () => {
    await loginAsStandardUser();

    await InventoryPage.addToCart(products.slug);
    await InventoryPage.goToCart();
    await CartPage.checkout();

    await CheckoutPage.firstNameInput.setValue("John");
    await CheckoutPage.lastNameInput.setValue("Doe");
    await CheckoutPage.continueButton.click();

    await expect(CheckoutPage.stepOneError).toBeDisplayed();
  });
});
