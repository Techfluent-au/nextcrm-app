/// <reference types="cypress" />

describe("Authentication", () => {
  it("should allow a user to sign in and out", () => {
    // Get the CSRF token
    cy.request("/api/auth/csrf").then((response) => {
      const csrfToken = response.body.csrfToken;

      // Sign in
      cy.request({
        method: "POST",
        url: "/api/auth/callback/credentials",
        form: true,
        body: {
          email: "test@example.com",
          password: "password",
          csrfToken: csrfToken,
          callbackUrl: "/en/dashboard",
          json: true,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.url).to.include("/en/dashboard");
      });
    });

    // At this point, the user should be signed in.
    // We can now test the sign-out flow.

    // Sign out
    cy.request({
      method: "POST",
      url: "/api/auth/signout",
      form: true,
      body: {
        csrfToken: "", // The CSRF token is not required for signout
        callbackUrl: "/en/sign-in",
        json: true,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
