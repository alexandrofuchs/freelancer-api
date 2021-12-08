const { DataTypes, Model } = require('sequelize');

class Message extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            serviceOrderId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: 'ServiceOrders', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            user:{
                type:DataTypes.STRING
            },
            message:{
                type: DataTypes.STRING,
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
        this.belongsTo(models.ServiceOrder, { foreignKey: 'serviceOrderId', as: 'order' });
    }
}

module.exports = Message;