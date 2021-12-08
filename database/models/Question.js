const { DataTypes, Model } = require('sequelize');

class Question extends Model {
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
            userName: {
                type: DataTypes.STRING,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            answer: {
                type: DataTypes.STRING,
            },
            question: {
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            }
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });  
        //this.belongsTo(models.Answer, { foreignKey: 'questionId', as: 'answer' });       
    }
}

module.exports = Question;