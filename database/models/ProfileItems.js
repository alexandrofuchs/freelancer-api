const { DataTypes, Model } = require('sequelize');

class ProfileItem extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(50),
            },
            description: {
                type: DataTypes.STRING(100),
            },
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Profile, { foreignKey: 'profileId', as: 'items' });
    }
}

module.exports = ProfileItem;