const { Sequelize, DataTypes, Model } = require('sequelize');

class Service extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },

        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId' });
        //this.hasMany(models.ServiceOrder, { foreignKey: 'serviceOrder' })
        this.hasMany(models.Question, { foreignKey: 'serviceId' });
        this.hasMany(models.Review, { foreignKey: 'serviceId' })
        this.hasOne(models.Schedule, {foreignKey: 'serviceId', as:'schedule'});
        this.hasMany(models.ServiceItem, {foreignKey: 'serviceId', as:'items' });
    }
}

module.exports = Service;

