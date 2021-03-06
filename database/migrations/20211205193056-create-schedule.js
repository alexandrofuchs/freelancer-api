'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Schedules', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      serviceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Services', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      startTime:{
        type: DataTypes.STRING,
        defaultValue:'none'
      },
      endTime:{
        type: DataTypes.STRING,
        defaultValue: 'none'
      },
      sunday:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      monday:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tuesday:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      wednesday:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      thursday:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      friday:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      saturday:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Schedules');
  }
};