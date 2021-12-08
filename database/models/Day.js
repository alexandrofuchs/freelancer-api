const { DataTypes, Model } = require('sequelize');

class Day extends Model {
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
            description: {
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
        this.belongsTo(models.ProfileItem, { foreignKey: 'ItemProfileId', as: 'item' });
    }
}

module.exports = Day;