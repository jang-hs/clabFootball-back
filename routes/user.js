const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Player = require('../models/player');
const Match = require('../models/match');

const router = express.Router();

// (get) 참가 신청한 경기 조회 -> 나의 경기
router.get('/:id/match', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id }, 
      attributes: ['id','email','nick'],
      include: { model:Player, 
        include: { model:Match}
      }
    });
    if (user) {
      const userData = user.get({ plain: true });
      console.log(userData)
      res.json({ userData, sucsess:true, message: 'success'});
    } else {
      res.status(404).json({ userData:undefined, sucsess:false, message: 'no user'});
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;