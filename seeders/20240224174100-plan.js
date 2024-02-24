'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const plans = [
      {
        "name": "Basic Plan",
        "steps": [
          {"name": "Consultation", "order": 1},
          {"name": "Session 1", "order": 2}
        ]
      },
      {
        "name": "Standard Plan",
        "steps": [
          {"name": "Consultation", "order": 1},
          {"name": "Session 1", "order": 2},
          {"name": "Session 2", "order": 3},
          {"name": "Session 3", "order": 4}
        ]
      },
      {
        "name": "Premium Plan",
        "steps": [
          {"name": "Consultation", "order": 1},
          {"name": "Session 1", "order": 2},
          {"name": "Session 2", "order": 3},
          {"name": "Session 3", "order": 4},
          {"name": "Session 4", "order": 5},
          {"name": "Session 5", "order": 6}
        ]
      }
    ]
    for (const plan of plans) {
      await queryInterface.sequelize.transaction(async (t) => {
        const createdPlan = await queryInterface.bulkInsert('Plans', [{
          name: plan.name,
          steps: JSON.stringify(plan.steps),
          createdAt: new Date(),
          updatedAt: new Date()
        }], { transaction: t });
        return createdPlan;
      });
    }

  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Plan', null, {});
  }
};
