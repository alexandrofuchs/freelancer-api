const { Sequelize, DataTypes, Model } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            firstName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.hasOne(models.Profile, { foreignKey: 'userId', as: 'profile' });
        this.hasMany(models.Service, { foreignKey: 'userId', as: 'services' });
        //this.hasMany(models.ServiceOrder, { foreignKey: 'serviceId', as: 'serviceOrders' });
    }
}

module.exports = User;