const Sequelize = require('sequelize');

module.exports = class Stadium extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      // 경기장 이름
      name: {
        type: Sequelize.STRING(40),
        allowNull: true,
      },
      // 경기장 주소
      address: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      // 면적
      size: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      // 샤워실
      isShower: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      // 주자 무료 유료 free paid
      parkingOption: {
        type: Sequelize.ENUM('free', 'paid'),
        allowNull: true,
      },
      // 주차장 정보
      parkingInfo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      // 풋살화 대여
      shoesOption: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      // 풋살화 정보
      shoesInfo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      // 운동복 대여
      clothesOption: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      // 운동복 정보
      clothesInfo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      // 경기장 설명
      stadiumInfo: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Stadium',
      tableName: 'stadiums',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // stadium과 match는 1:N 관계
    db.Stadium.hasMany(db.Match, { foreignKey: 'stadiumId', sourceKey: 'id' });
  }
};