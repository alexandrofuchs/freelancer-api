const { DataTypes, Model } = require('sequelize');

class Profile extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            biography: {
                type: DataTypes.STRING(200),
            },
            otherInfo: {
                type: DataTypes.STRING(200),
            },
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        this.hasMany(models.ProfileItem, { foreignKey: 'profileId', as: 'items' });
    }

}

module.exports = Profile;