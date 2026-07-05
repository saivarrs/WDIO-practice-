import Page from "./Page.js";

class CheckoutPage extends Page {
  get firstNameInput() {
    return $('[data-test="firstName"]');
  }

  get lastNameInput() {
    return $('[data-test="lastName"]');
  }

  get postalCodeInput() {
    return $('[data-test="postalCode"]');
  }

  get continueButton() {
    return $('[data-test="continue"]');
  }

  get stepOneError() {
    return $('[data-test="error"]');
  }

  get finishButton() {
    return $('[data-test="finish"]');
  }

  get completeHeader() {
    return $(".complete-header");
  }

  async fillCustomerInfo(firstName, lastName, postalCode) {
    await this.firstNameInput.setValue(firstName);
    await this.lastNameInput.setValue(lastName);
    await this.postalCodeInput.setValue(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}

export default new CheckoutPage();
