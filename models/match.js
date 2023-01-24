const Sequelize = require('sequelize');

module.exports = class Match extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      // 경기 일자
      scheduleDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      // 경기 시간
      scheduleTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      // 경기장 이름
      scheduleInfo: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      // 참가자 성별 isMen, isWomen, isMix
      optionSex: {
        type: Sequelize.ENUM('isMen', 'isWomen', 'isMix'),
        allowNull: false,
        defaultValue: 'isMix',
      },
      // 경기 유형(6vs6, 5vs5, 3파전)
      optionMatch: {
        type: Sequelize.ENUM('6vs6', '5vs5', '3파전'),
        allowNull: true,
        defaultValue: '6vs6',
      },
      // 경기 수준(모든 레벨, 아마추어 이하, ... )
      optionLevel: {
        type: Sequelize.STRING(30),
        allowNull: true, 
      },
      // 총 경기 인원
      optionSize: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
      },
      // 경기 신청 마감 여부
      optionEnd: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },
      // 경기장 id
      stadiumId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:1
      }
    }, {
      //timestamps, paranoid true -> createAt, updatedAt, deleteAt 컬럼도 생성됨.
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Match',
      tableName: 'matchs',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // match 와 Player 는 1:N 관계
    db.Match.hasMany(db.Player, { foreignKey: 'matchId', sourceKey: 'id' });
    db.Match.belongsTo(db.Stadium, { foreignKey: 'stadiumId', targetKey: 'id' });
  }
};