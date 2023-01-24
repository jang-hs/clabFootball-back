const express = require('express');
const Match = require('../models/match');
const Player = require('../models/player');
const router = express.Router();

// MATCH ROUTER
router.route('/')
  // 모든 경기 정보 조회 (get)
  .get(async (req, res, next) => {
    try {
      const match = await Match.findAll({ include: {model:Player}});
      res.json(match.map(el => el.get({ plain: true })));
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  // 신규 경기 등록 (post)
  .post(async (req, res, next) => {
    try {
      const match = await Match.create({
        scheduleDate: req.body.scheduleDate,
        scheduleTime: req.body.scheduleTime,
        scheduleInfo: req.body.scheduleInfo,
        optionSex: req.body.optionSex,
        optionMatch: req.body.optionMatch,
        optionLevel: req.body.optionLevel,
        optionSize: req.body.optionSize,
        optionEnd: req.body.optionEnd,
        stadiumId: req.body.stadiumId
      });
      console.log(match);
      res.status(201).json(match);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  // 경기 정보 수정 (patch)
  .patch(async (req, res, next) => {
    try {
      let updateData = req.body
      const match = await Match.update(
        updateData, 
        { where: { id: updateData.id },}
      );
      res.json(match);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
router.get('/:id', async (req, res, next) => {
  try {
    const match = await Match.findOne({ where: { id: req.params.id }, raw:true });
    if (match) {
      res.json({ match, sucsess:true, message: 'success'});
    } else {
      res.status(404).json({ sucsess:false, message: 'no match'});
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;