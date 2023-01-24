const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      // 계정 이메일
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      // 닉네임
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      // 비밀번호
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      // 성별
      sex: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      // 사용자 레벨
      level: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      // 계정 제공자
      provider: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'local',
      },
      // sns ID
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      //timestamps, paranoid true -> createAt, updatedAt, deleteAt 컬럼도 생성됨.
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // user 와 Player 는 1:N 관계
    db.User.hasMany(db.Player, { foreignKey: 'userId', sourceKey: 'id' });
  }
};