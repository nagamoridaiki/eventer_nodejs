'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Event.init({
        userId: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: "利用者は必須です。"
                }
            }
        },
        title: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "タイトルは必須です。"
                },
                len: {
                    args: [1, 50],
                    msg: "1〜50字以内で入力してください"
                }
            }
        },
        subTitle: DataTypes.STRING,
        image: DataTypes.STRING,
        detail: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "本文は必須です。"
                },
                len: {
                    args: [1, 140],
                    msg: "1〜140字以内で入力してください"
                }
            }
        },
        holdDate: DataTypes.DATE,
        isPrivate: DataTypes.BOOLEAN,
        capacity: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Event',
    });
    return Event;
};