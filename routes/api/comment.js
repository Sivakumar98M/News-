var express = require('express');
var router = express.Router();

router.post('/add',async function (req,res) {
    let body = req.body;

    let errors=[];
    let comment;
	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		}
		catch (err) {
			errors.push(`Unable to parse request body. ${err.message}`);
		}
	}
   
    let document = {}
        document.comment=body.comment,
        document.date= new Date().getTime(),
        document.newsid = body.newsid,
        document.usersid = body.usersid
    try {
        comment = await mongoDB.addComment(document);
    }
    catch (err) {
        
        errors.push(`Unable to create comment. ${err.message}`);
    }
    
	if (errors.length === 0) {
		res.send({ status: 'SUCCESS', comment: comment });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
})




router.post('/getcomment',async function (req,res) {
    let body = req.body;
    let errors=[];
    let comment;
    let searchCriteria ={}
	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		}
		catch (err) {
			errors.push(`Unable to parse request body. ${err.message}`);
		}
	}
    if(errors.length === 0){
        let keys=Object.keys(body);
        if(keys.includes('newsid')){
            searchCriteria.newsid=body.newsid;
        }
        if(keys.includes('usersid')){
            searchCriteria.usersid=body.usersid;
        }
    }
    try {
       
        comment = await mongoDB.getComment(searchCriteria);
    }
    catch (err) {
        errors.push(`Unable to create comment. ${err.message}`);
    }
	if (errors.length === 0) {
	    	res.send({ status: 'SUCCESS', comment: comment });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
})

module.exports = router;