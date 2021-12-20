const { Sequelize, DataTypes, Model } = require('sequelize');

class ServiceOrder extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            serviceId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: 'Services', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            userServiceId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            date: {
                type: DataTypes.STRING,
            },
            hour: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.ENUM('pending', 'accepted','concluded','rescheduled','cancelled'),
                defaultValue: 'pending',
            },
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId', as: "user" });
        this.belongsTo(models.User, { foreignKey: 'userServiceId', as: "userService" });
        this.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });
        this.hasOne(models.Message, { foreignKey: 'serviceOrderId', as: 'chat'});
    }
}

module.exports = ServiceOrder;

