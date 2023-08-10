'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('trips', 'vessel_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('trips', 'vessel_id');
  },
};
