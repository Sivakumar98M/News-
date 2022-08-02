var express = require('express');
var router = express.Router();

router.post('/add',async function (req,res) {
    let body = req.body;
    let errors=[];
    let user;
	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		}
		catch (err) {
			errors.push(`Unable to parse request body. ${err.message}`);
		}
	}
    let document = {
        name:body.name,
        email:body.email,
        password:body.password,
        number:body.number,
        role:body.role
    }
    try {
        user = await mongoDB.addUser(document);
    }
    catch (err) {
        errors.push(`Unable to create user. ${err.message}`);
    }
    
	if (errors.length === 0) {
		res.send({ status: 'SUCCESS', user: user });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
})



router.post('/getuser',async function (req,res) {
    let body = req.body;
    let errors=[];
    let user;
	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		}
		catch (err) {
			errors.push(`Unable to parse request body. ${err.message}`);
		}
	}
     let searchCriteria={};
    if(errors.length === 0){
        let keys=Object.keys(body);
        if(keys.includes('id')){
            searchCriteria._id=body.id;
        }
        if(keys.includes('email')){
            searchCriteria.email=body.email;
        }else{
            errors.push("Email should be provided");
        }
        if(keys.includes('password')){
            searchCriteria.password=body.password;
        }else{
            errors.push("password should be provided");
        }
    }
    try {
        user = await mongoDB.getUser(searchCriteria);
    }
    catch (err) {
        errors.push(`Unable to create user. ${err.message}`);
    }
    
	if (errors.length === 0) {
        if(user.length>0){
	    	res.send({ status: 'SUCCESS', user: user });
        }else{
            res.send({status:"ERROR", errors:"Invalid user name or password"})
        }
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
})








module.exports = router;