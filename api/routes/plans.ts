import express from 'express';

let router = express.Router();

router.get(':building/:floor', async (req, res, next) => {
  try {
    return res.json();
  } catch (err) {
    console.error(err);
    next();
  }
});

export = router;
