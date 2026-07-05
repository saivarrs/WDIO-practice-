import Page from "./Page.js";

class CartPage extends Page {
  get checkoutButton() {
    return $('[data-test="checkout"]');
  }

  get cartItems() {
    return $$(".cart_item");
  }

  get continueShoppingButton() {
    return $('[data-test="continue-shopping"]');
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async getItemCount() {
    const items = await this.cartItems;
    return items.length;
  }
}

export default new CartPage();
