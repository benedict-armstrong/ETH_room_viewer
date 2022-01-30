import express from 'express';

let router = express.Router();

router.get('', async (req, res, next) => {
  try {
    const fileName = 'test.webp';
    res.sendFile(fileName, { root: __dirname }, function (err) {
      if (err) {
        next(err);
      } else {
        console.log('Sent:', fileName);
      }
    });
  } catch (err) {
    console.error(err);
    next();
  }
});

export = router;
