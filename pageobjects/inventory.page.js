import Page from "./Page.js";

class InventoryPage extends Page {
  get title() {
    return $(".title");
  }

  get sortDropdown() {
    return $(".product_sort_container");
  }

  get itemNames() {
    return $$(".inventory_item_name");
  }

  get itemPrices() {
    return $$(".inventory_item_price");
  }

  get cartBadge() {
    return $(".shopping_cart_badge");
  }

  get cartLink() {
    return $(".shopping_cart_link");
  }

  addToCartButton(productSlug) {
    return $(`[data-test="add-to-cart-${productSlug}"]`);
  }

  removeFromCartButton(productSlug) {
    return $(`[data-test="remove-${productSlug}"]`);
  }

  async addToCart(productSlug) {
    await this.addToCartButton(productSlug).click();
  }

  async removeFromCart(productSlug) {
    await this.removeFromCartButton(productSlug).click();
  }

  async sortBy(option) {
    await this.sortDropdown.selectByAttribute("value", option);
  }

  async getItemNames() {
    return this.itemNames.map((el) => el.getText());
  }

  async getItemPrices() {
    const raw = await this.itemPrices.map((el) => el.getText());
    return raw.map((p) => parseFloat(p.replace("$", "")));
  }

  async goToCart() {
    await this.cartLink.click();
  }
}

export default new InventoryPage();
