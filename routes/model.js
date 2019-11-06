var express = require('express');
var router = express.Router();
var needauth = require('./lib/need-auth');

const exec = require('await-exec');


/* GET home page. */
router.get('/:fname', async (req, res, next) => {
    var audio_path = './deepmusic/data/'+req.params.fname;
    var cmd = 'python ./deepmusic/for_express_deep_music.py ' + audio_path;
    var result; 

    const { stdout, stderr } = await exec(cmd);
    var info = {
        music_name : stdout,
    }
    res.json(info)
});


module.exports = router;