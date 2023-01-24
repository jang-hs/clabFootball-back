const Sequelize = require('sequelize');

module.exports = class Player extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      isPlayer: {
        type: Sequelize.BOOLEAN,
        allowNull: false, //마감여부
        defaultValue:true
      },
    }, {
      //timestamps -> createAt, updatedAt 컬럼도 생성됨.
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Player',
      tableName: 'players',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) { // 다른 모델의 정보가 들어가는 테이블에 belongsTo를 사용.
    db.Player.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    db.Player.belongsTo(db.Match, { foreignKey: 'matchId', targetKey: 'id' });
  }
};