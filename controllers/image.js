const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '6118c0419fd54fb3951c0dfef4e06da3'
});

const handleApiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'));
};

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .then(() => {
            db.select('entries').from('users').where('id', '=', id)
                .then(entries => {
                    res.json(entries[0]);
                });
        }).catch(err => res.status(400).json('unable to get entries'));
};

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};