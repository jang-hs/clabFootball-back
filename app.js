const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport')

dotenv.config({ path: path.join(__dirname, '/.env') });
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const matchRouter = require('./routes/match');
const playerRouter = require('./routes/player');
const stadiumRouter = require('./routes/stadium');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
passportConfig();
app.set('port', process.env.PORT || 8001);

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/match', matchRouter);
app.use('/player', playerRouter);
app.use('/stadium', stadiumRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500).send('Something broke!');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), ' port waiting!')
})