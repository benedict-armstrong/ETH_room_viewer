import express from 'express';
import {
  getAllRooms,
  getAllRoomsStudyTime,
  getMapDataByBuilding,
  getRoomById,
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
    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Building not found or no map data available',
      });
    }
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

router.get('/:room_id', async (req, res, next) => {
  try {
    const room_id = parseInt(req.params.room_id);
    const rows = (await getRoomById(room_id)).rows;
    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Room not found',
      });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    next();
  }
});

export = router;
