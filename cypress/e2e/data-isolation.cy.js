/// <reference types="cypress" />

describe("Data Isolation", () => {
  it("should prevent a user from one organization from accessing data from another", () => {
    // Get the CSRF token
    cy.request("/api/auth/csrf").then((response) => {
      const csrfToken = response.body.csrfToken;

      // Sign in as user2@org2.com
      cy.request({
        method: "POST",
        url: "/api/auth/callback/credentials",
        form: true,
        body: {
          email: "user2@org2.com",
          password: "password",
          csrfToken: csrfToken,
          callbackUrl: "/en/dashboard",
          json: true,
        },
      });
    });

    // Now, as an authenticated user from Organization 2,
    // try to access contacts. This should return an empty array, as
    // there are no contacts in Organization 2.
    cy.request({
      url: `/api/crm/contacts`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(0);
    });

    // To be absolutely sure, we'll try to get the contact from Org 1
    // by first getting its ID.  We need to do this by logging in as
    // the Org 1 user.
    cy.request("/api/auth/csrf").then((response) => {
      const csrfToken = response.body.csrfToken;

      // Sign in as user1@org1.com
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

    let contactId;
    cy.request("/api/crm/contacts").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(1);
      contactId = response.body[0].id;

      // Now, log back in as user2@org2.com and try to access the contact
      // directly.
      cy.request("/api/auth/csrf").then((response) => {
        const csrfToken = response.body.csrfToken;

        // Sign in as user2@org2.com
        cy.request({
          method: "POST",
          url: "/api/auth/callback/credentials",
          form: true,
          body: {
            email: "user2@org2.com",
            password: "password",
            csrfToken: csrfToken,
            callbackUrl: "/en/dashboard",
            json: true,
          },
        });
      });

      cy.request({
        url: `/api/crm/contacts/${contactId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });
});
