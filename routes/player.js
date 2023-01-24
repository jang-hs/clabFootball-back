const express = require('express');
const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Match = require('../models/match');
const Player = require('../models/player');
const router = express.Router();

// PLAYER ROUTER 

router.route('/')
  // 경기 참가 신청(post)
  .post(async (req, res, next) => {
    try {
      const exUser = await User.findOne({ where: { id: req.body.userId }, raw: true});
      if (!exUser) {
        return res.json({ sucsess:false, message: '사용자가 없습니다.'});
      }
      const exMatch = await Match.findOne({ where: { id:req.body.matchId }, raw: true});
      if (!exMatch) {
        return res.json({ sucsess:false, message: '신청 가능한 경기가 없습니다.'});
      }
      if (exMatch.optionEnd) {
        return res.json({ sucsess:false, message: '신청이 마감된 경기입니다.'});
      }
      else {
        Player.findAll({
          where: { matchId: req.body.matchId },
          raw: true
        }).then( async (sPlayerResult) => {
          let sPlayerArray = sPlayerResult.filter(sPlayer => sPlayer.isPlayer); // 실제 신청 완료된 참여자
          let sCurrentSize = sPlayerArray.length;
          let sHasPlayer = sPlayerArray.filter(sPlayer => sPlayer.userId === req.body.userId)
          if (sHasPlayer.length > 0){
            return res.json({ sucsess:false, message: '이미 신청한 경기입니다.'});
          } else {
            if (sCurrentSize < exMatch.optionSize) {
              const player = await Player.create({
                userId: req.body.userId,
                matchId: req.body.matchId,
                isPlayer: true,
              });
              // 마감 상태로 업데이트.
              if (sCurrentSize+1 === exMatch.optionSize){
                await Match.update({ optionEnd:true }, { where: { id: req.body.matchId }});
              }
              res.status(201).json({ sucsess:true, ...player });
            }
          }
        })
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  // 경기 정보 수정 (patch)
  .patch(async (req, res, next) => {
    try {
      let updateData = req.body
      const exUser = await User.findOne({ where: { id:req.body.userId }, raw: true});
      if (!exUser) {
        return res.json({ sucsess:false, message: '사용자가 없습니다.'});
      }
      const exMatch = await Match.findOne({ where: { id:req.body.matchId }, raw: true});
      if (!exMatch) {
        return res.json({ sucsess:false, message: '신청 가능한 경기가 없습니다.'});
      }
      if (exMatch.optionEnd && updateData.isPlayer) {
        return res.json({ sucsess:false, message: '이미 신청이 마감되었습니다.'});
      }

      const updatePlayer = await Player.update(
        updateData, 
        { where: { userId: updateData.userId, matchId: updateData.matchId }}
      );

      Player.findAll({
        where: { matchId: req.body.matchId },
        raw: true
      }).then( async (sPlayerResult) => {
        let sPlayerArray = sPlayerResult.filter(sPlayer => sPlayer.isPlayer); // 실제 신청 완료된 참여자
        let sCurrentSize = sPlayerArray.length;
        if (sCurrentSize < exMatch.optionSize) {
          await Match.update({ optionEnd:false }, { where: { id: req.body.matchId }});
        }
        
        if (sCurrentSize === exMatch.optionSize){
          await Match.update({ optionEnd:true }, { where: { id: req.body.matchId }});
        }
        res.status(201).json(updatePlayer);
      })
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  
module.exports = router;