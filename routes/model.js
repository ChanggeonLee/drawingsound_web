var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');

const exec = require('await-exec');

/* GET home page. */
router.get('/:fname', async (req, res, next) => {
     var audio_path = './wave/'+req.params.fname;
     var cmd = 'python3 ./deepmusic/for_express_deep_music.py ' + audio_path;
     var result; 

     const { stdout, stderr } = await exec(cmd);
     var info = {
        music_name : stdout,
     }
     res.json(info)
});

router.post('/musicname', async (req, res, next) => {
     fs.writeFile('wave/data.wav', req.body, function(err) {});
     var audio_path = './wave/data.wav';
     var cmd = 'python3 ./deepmusic/for_express_deep_music.py ' + audio_path;
     var result; 

     const { stdout, stderr } = await exec(cmd);
     //var info = {
       // music_name : stdout,
     //}
     //res.json(info)

     res.send(stdout);
     res.end();
});

/*
router.post('/musicname', upload.single('wave'), async (req, res, next) => {
	console.log(req.file);
    var audio_path =  req.file.path;
    var cmd = 'python ./deepmusic/for_express_deep_music.py ' + audio_path;

    const { stdout, stderr } = await exec(cmd);
    var info = {
        music_name : stdout,
    }
    res.json(info);
});*/



module.exports = router;
