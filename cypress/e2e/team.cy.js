/// <reference types="cypress" />

describe("Team and Role Management", () => {
  it("should allow a user to invite a new team member", () => {
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

    // Invite a new team member
    cy.request({
      method: "POST",
      url: "/api/organization/invitations",
      body: {
        email: "new.member@example.com",
        role: "MEMBER",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
