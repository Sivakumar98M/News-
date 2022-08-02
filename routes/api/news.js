var express = require('express');
var router = express.Router();
const { uuid } = require('uuidv4');
const fs = require('fs');

router.post('/add', async function (req, res) {
    let body = req.body;
    let errors = [];
    let news;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        }
        catch (err) {
            errors.push(`Unable to parse request body. ${err.message}`);
        }
    }

    let document = {}
    document.title = body.title,
        document.content = body.content,
        document.category = body.category,
        // document.images= body.images,
        document.date = new Date().getTime();
    if (body.images.trim() != "") {
        let filename = uuid();
        var base64Data = body.images.replace(/^data:image\/(?:gif|png|jpeg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,/, "");
        var bitmap = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(`attache/${filename}.` + body.filename, bitmap);
        document.images = filename + "." + body.filename;
    }
    try {
        news = await mongoDB.addNews(document);
    }
    catch (err) {
        errors.push(`Unable to create news. ${err.message}`);
    }

    if (errors.length === 0) {
        res.send({ status: 'SUCCESS', news: news });
    }
    else {
        res.send({ status: 'ERROR', errors: 'error' });
    }
})



// 
router.post('/getnews', async function (req, res) {
    let body = req.body;
    let errors = [];
    let news;
    let searchCriteria = {}
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        }
        catch (err) {
            errors.push(`Unable to parse request body. ${err.message}`);
        }
    }
    if (errors.length === 0) {
        let keys = Object.keys(body);
        if (keys.includes('id')) {
            searchCriteria._id = body.id;
        }

        if (keys.includes('text')) {
            if (searchCriteria.title) {
                searchCriteria.title = undefined;
            }
            if (searchCriteria.description) {
                searchCriteria.description = undefined
            }
            searchCriteria['$or'] = [
                {
                    'title': {
                        '$regex': `.*${body.text}.*`,
                        '$options': 'i'
                    }
                },
                {
                    'description': {
                        '$regex': `.*${body.text}.*`,
                        '$options': 'i'
                    }
                }
            ];
        }


    }
    try {

        news = await mongoDB.getNews(searchCriteria);
    }
    catch (err) {
        errors.push(`Unable to create news. ${err.message}`);
    }
    if (errors.length === 0) {
        if (news.length > 0) {
            res.send({ status: 'SUCCESS', news: news });
        } else {
            res.send({ status: "ERROR", errors: "unable to view news" })
        }
    }
    else {
        res.send({ status: 'ERROR', errors: errors });
    }
})


// 




module.exports = router;