var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'wave/' })

const exec = require('await-exec');


// /* GET home page. */
// router.get('/:fname', async (req, res, next) => {
//     var audio_path = './deepmusic/data/'+req.params.fname;
//     var cmd = 'python ./deepmusic/for_express_deep_music.py ' + audio_path;
//     var result; 

//     const { stdout, stderr } = await exec(cmd);
//     var info = {
//         music_name : stdout,
//     }
//     res.json(info)
// });

/* GET home page. */
router.post('/musicname', upload.single('wave'), async (req, res, next) => {
    var audio_path =  req.file.path;
    var cmd = 'python ./deepmusic/for_express_deep_music.py ' + audio_path;

    const { stdout, stderr } = await exec(cmd);
    var info = {
        music_name : stdout,
    }
    res.json(info);
});



module.exports = router;