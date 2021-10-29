const { Sequelize, DataTypes, Model } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize
        })
    }
}

module.exports = User;