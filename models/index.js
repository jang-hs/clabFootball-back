// sequelize 연결
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
// 연동할 때에는 config/config.json의 정보를 사용함.
const config = require('../config/config')[env];
const User = require('./user');
const Player = require('./player');
const Match = require('./match');
const Stadium = require('./stadium');
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.Match = Match;
db.Stadium = Stadium;
db.Player = Player;

User.init(sequelize);
Match.init(sequelize);
Stadium.init(sequelize);
Player.init(sequelize);

User.associate(db);
Match.associate(db);
Stadium.associate(db);
Player.associate(db);

module.exports = db;