'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  EventTag.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Event',
          key: 'id'
      }
  },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Tag',
          key: 'id'
      }
  }
  }, {
    sequelize,
    modelName: 'EventTag',
  });
  return EventTag;
};