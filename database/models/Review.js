const { Sequelize, DataTypes, Model } = require('sequelize');

class Review extends Model {
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
              grade: {
                type: DataTypes.INTEGER,
              },
              title: {
                type: DataTypes.STRING,
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
        this.belongsTo(models.Service, { foreignKey: 'serviceId' });
        this.belongsTo(models.User, { foreignKey: 'userId' });
    }
}

module.exports = Review;

