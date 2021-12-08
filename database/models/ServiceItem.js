const { Sequelize, DataTypes, Model } = require('sequelize');

class ServiceItem extends Model {
    static init(sequelize) {
        super.init({
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
              title: {
                type: DataTypes.STRING(100),
              },
              description: {
                type: DataTypes.STRING(100),
              },
              createdAt: {
                allowNull: false,
                type: DataTypes.DATE
              },
              updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
              }
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Service, { foreignKey: 'serviceId', as: "service" });
    }
}

module.exports = ServiceItem;

