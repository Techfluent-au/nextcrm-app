//import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
/*
Seed data is used to populate the database with initial data.
*/
//Menu Items
const moduleData = require("../initial-data/system_Modules_Enabled.json");
//GPT Models
const gptModelsData = require("../initial-data/gpt_Models.json");
//CRM
const crmOpportunityTypeData = require("../initial-data/crm_Opportunities_Type.json");
const crmOpportunitySaleStagesData = require("../initial-data/crm_Opportunities_Sales_Stages.json");
const crmCampaignsData = require("../initial-data/crm_campaigns.json");
const crmIndustryTypeData = require("../initial-data/crm_Industry_Type.json");

const prisma = new PrismaClient();

async function main() {
  // Your seeding logic here using Prisma Client
  console.log("-------- Seeding DB --------");

  //Seed Menu Items
  const modules = await prisma.system_Modules_Enabled.findMany();

  if (modules.length === 0) {
    await prisma.system_Modules_Enabled.createMany({
      data: moduleData,
    });
    console.log("Modules seeded successfully");
  } else {
    console.log("Modules already seeded");
  }

  //Seed CRM Opportunity Types
  const crmOpportunityType = await prisma.crm_Opportunities_Type.findMany();

  if (crmOpportunityType.length === 0) {
    await prisma.crm_Opportunities_Type.createMany({
      data: crmOpportunityTypeData,
    });
    console.log("Opportunity Types seeded successfully");
  } else {
    console.log("Opportunity Types already seeded");
  }

  const crmOpportunitySaleStages =
    await prisma.crm_Opportunities_Sales_Stages.findMany();

  if (crmOpportunitySaleStages.length === 0) {
    await prisma.crm_Opportunities_Sales_Stages.createMany({
      data: crmOpportunitySaleStagesData,
    });
    console.log("Opportunity Sales Stages seeded successfully");
  } else {
    console.log("Opportunity Sales Stages already seeded");
  }

  const crmCampaigns = await prisma.crm_campaigns.findMany();

  if (crmCampaigns.length === 0) {
    await prisma.crm_campaigns.createMany({
      data: crmCampaignsData,
    });
    console.log("Campaigns seeded successfully");
  } else {
    console.log("Campaigns already seeded");
  }

  const crmIndustryType = await prisma.crm_Industry_Type.findMany();

  if (crmIndustryType.length === 0) {
    await prisma.crm_Industry_Type.createMany({
      data: crmIndustryTypeData,
    });
    console.log("Industry Types seeded successfully");
  } else {
    console.log("Industry Types already seeded");
  }

  //Seed GPT Models
  const gptModels = await prisma.gpt_models.findMany();

  if (gptModels.length === 0) {
    await prisma.gpt_models.createMany({
      data: gptModelsData,
    });
    console.log("GPT Models seeded successfully");
  } else {
    console.log("GPT Models already seeded");
  }

  // Clean up existing test data
  await prisma.crm_Contacts.deleteMany({
    where: {
      email: {
        in: ["contact1@org1.com"],
      },
    },
  });

  await prisma.users.deleteMany({
    where: {
      email: {
        in: ["user1@org1.com", "user2@org2.com"],
      },
    },
  });

  await prisma.organizations.deleteMany({
    where: {
      slug: {
        in: ["org1", "org2"],
      },
    },
  });

  // Create two organizations and two users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password", salt);

  const org1 = await prisma.organizations.create({
    data: {
      name: "Organization 1",
      slug: "org1",
      plan: "FREE",
      stripeCustomerId: "org1-customer-id",
      owner: {
        create: {
          email: "user1@org1.com",
          password: hashedPassword,
          name: "User 1",
          userStatus: "ACTIVE",
        },
      },
    },
  });

  const org2 = await prisma.organizations.create({
    data: {
      name: "Organization 2",
      slug: "org2",
      plan: "FREE",
      stripeCustomerId: "org2-customer-id",
      owner: {
        create: {
          email: "user2@org2.com",
          password: hashedPassword,
          name: "User 2",
          userStatus: "ACTIVE",
        },
      },
    },
  });

  // Create a contact in Organization 1
  await prisma.crm_Contacts.create({
    data: {
      first_name: "Contact",
      last_name: "One",
      email: "contact1@org1.com",
      organizationId: org1.id,
    },
  });

  console.log("Test data for isolation test seeded successfully");

  console.log("-------- Seed DB completed --------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
