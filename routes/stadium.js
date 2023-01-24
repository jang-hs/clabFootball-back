const express = require('express');
const Stadium = require('../models/stadium');
const router = express.Router();

// STADIUM ROUTER

// 신규 경기장 등록 (post)
router.post('/', async (req, res, next) => {
  try {
    const stadium = await Stadium.create({
      name: req.body.name,
      address: req.body.address,
      size: req.body.size,
      isShower: req.body.isShower,
      parkingOption: req.body.parkingOption,
      parkingInfo: req.body.parkingInfo,
      shoesOption: req.body.shoesOption,
      clothesOption: req.body.clothesOption,
      stadiumInfo: req.body.stadiumInfo,
    });
    console.log(stadium);
    res.status(201).json(stadium);
  } catch (err) {
    console.error(err);
    next(err);
  }
})
// 경기장 정보 조회(get)
router.get('/:id', async (req, res, next) => {
  try {
    const stadium = await Stadium.findOne({
      where: { id: req.params.id }
    });
    if (stadium) {
      const stadiumData = stadium.get({ plain: true });
      console.log(stadiumData)
      res.json({ stadiumData, sucsess: true, message: 'success' });
    } else {
      res.status(404).json({ stadiumData: undefined, sucsess: false, message: 'no stadium' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
})
  // 경기장 정보 수정 (patch)
  .patch(async (req, res, next) => {
    try {
      let updateData = req.body
      const stadium = await Stadium.update(
        updateData,
        { where: { id: req.params.id }, }
      );
      res.json(stadium);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

module.exports = router;