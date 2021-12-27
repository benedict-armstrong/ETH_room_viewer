import express from 'express';
import { getAllRooms } from '../dao';

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

export = router;
