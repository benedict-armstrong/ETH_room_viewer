import express from 'express';
import {
  getAllRooms,
  getAllRoomsStudyTime,
  getMapDataByBuilding,
} from '../dao';

let router = express.Router();

router.get('', async (req, res, next) => {
  try {
    const rows = (await getAllRooms()).rows;
    return res.json(rows);
  } catch (err) {
    console.error(err);
    next();
  }
});

router.get('/map-data/:building', async (req, res, next) => {
  try {
    const rows = (await getMapDataByBuilding(req.params.building.toUpperCase()))
      .rows;
    return res.json(rows);
  } catch (err) {
    console.error(err);
    next();
  }
});

router.get('/lernphase', async (req, res, next) => {
  try {
    const rows = (await getAllRoomsStudyTime()).rows;
    return res.json(rows);
  } catch (err) {
    console.error(err);
    next();
  }
});

export = router;
