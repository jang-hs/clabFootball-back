const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

// 회원가입 라우터.
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password1, password2, sex } = req.body;
  try {
    // 1. 기존에 같은 이메일로 가입한 사용자가 있는지 조회.
    const exUser = await User.findOne({ where: { email }});
    // 동일한 사용자가 있다면 회원가입 페이지로 돌려보냄.
    if (exUser) {
      return res.json({ sucsess:false, message: '동일한 사용자가 있습니다.'});
    }
    if (password1 !== password2){
      return res.json({ sucsess:false, message: '비밀번호 입력 값이 서로 다릅니다.'});
    }
    // 같은 이메일로 가입한 사용자가 없다면 비밀번호를 암호화
    const hash = await bcrypt.hash(password1, 12);
    // 사용자 정보 생성
    await User.create({
      email,
      nick,
      password: hash,
      sex
    });
    return res.json({ sucsess:true, message: 'User Join Sucsess'});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {
  // 로그인 요청이 들어오면 미들웨어가 로그인 전략 수행.
  passport.authenticate('local', (authError, user, info) => {
    // 전략 실패시 authError 값 있음.
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.json({ sucsess:false, message: info.message});
    }
    // req.login은 passport.serializeUser를 호출함.
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.json({ 
        user: {
          id: user.id,
          email: user.email,
          sex: user.sex,
          nick: user.nick
        }
        , sucsess:true, message: "user Login"});

    });
  })(req, res, next); //미들웨어 내의 미들웨어는 (req, res, next)를 붙여줘야 함.(사용자 정의 기능 추가하고 싶을 때.)
});
// 로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout(); // user 객체 제거
  req.session.destroy(); // req.session 객체의 내용을 제거
  res.redirect('/'); // 메인 페이지로 돌아가면 로그인 해제 되어있음.
});

module.exports = router;