import Page from "./Page.js";

class LoginPage extends Page {
  get usernameInput() {
    return $('[data-test="username"]');
  }

  get passwordInput() {
    return $('[data-test="password"]');
  }

  get loginButton() {
    return $('[data-test="login-button"]');
  }

  get errorMessage() {
    return $('[data-test="error"]');
  }

  get logo() {
    return $(".login_logo");
  }

  async open() {
    return super.open("/");
  }

  async login(username, password) {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }
}

export default new LoginPage();
