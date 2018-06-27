const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'PhiCloud API!' });
});

router.get('/test', (req, res) => {
    res.status(200).json({ message: 'GET /test' });
});

module.exports = router;