export const config = {
  runner: "local",

  specs: ["./test/specs/**/*.spec.js"],

  maxInstances: 10,

  capabilities: [
    {
      browserName: "chrome",
    },
  ],

  logLevel: "warn",

  baseUrl: "https://www.saucedemo.com",

  framework: "mocha",
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },

  reporters: ["spec"],

  specFileRetries: process.env.CI ? 2 : 0,

// i hate wdio xd
  afterTest: async function () {
    await browser.deleteAllCookies();
    await browser.execute(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  },
};
