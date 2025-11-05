/// <reference types="cypress" />

describe("Billing and Subscriptions", () => {
  it("should create a Stripe checkout session for the PRO plan", () => {
    // Get the CSRF token
    cy.request("/api/auth/csrf").then((response) => {
      const csrfToken = response.body.csrfToken;

      // Sign in
      cy.request({
        method: "POST",
        url: "/api/auth/callback/credentials",
        form: true,
        body: {
          email: "user1@org1.com",
          password: "password",
          csrfToken: csrfToken,
          callbackUrl: "/en/dashboard",
          json: true,
        },
      });
    });

    // Create a checkout session for the PRO plan
    cy.request({
      method: "POST",
      url: "/api/billing/create-checkout-session",
      body: {
        plan: "PRO",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("url");
      expect(response.body.url).to.include("https://checkout.stripe.com/c/pay/");
    });
  });
});
