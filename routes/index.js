var express = require('express');
var router = express.Router();
var serviceCall = require('./serviceCall');
var path=require('path');
const fs=require('fs');
var session = require('express-session');

router.get('/logout', async function (req, res) {
  req.session.destroy();
  res.redirect('/');
});


/* GET home page. */
router.get('/', async function (req, res, next) {
  let category="all";
  if(req.query != undefined && req.query.category != undefined){
    category=req.query.category;
  }
  console.log(req.query);
  let output;
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/news/getnews`);
    if (response.statusCode === 200) {
      if (response.body.status === 'SUCCESS') {

        output = response.body.news;

      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create post. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }
  res.render('index', { title: 'NEWS', output: output, category:category  });
});
router.get('/index-login', async function (req, res, next) {
  let category="all";
  if(req.query != undefined && req.query.category != undefined){
    category=req.query.category;
    
  }
    console.log(req.query.category)

  let output;
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/news/getnews`);
    if (response.statusCode === 200) {
      if (response.body.status === 'SUCCESS') {

        output = response.body.news;

      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create post. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }

  res.render('index-login', { title: 'NEWS', output: output, category:category });
});
router.get('/login', async function (req, res, next) {
  res.render('login');
});
router.get('/register', async function (req, res, next) {
  res.render('register');
});

router.get('/about', async function (req, res, next) {
  res.render('about',{ title: 'NEWS'});
});
router.get('/aboutlogin', async function (req, res, next) {
  res.render('aboutlogin',{ title: 'NEWS'});
});
router.get('/aboutadmin', async function (req, res, next) {
  res.render('aboutadmin',{ title: 'NEWS'});
});

router.get('/admin', async function (req, res, next) {
  let category="all";
  if(req.query != undefined && req.query.category != undefined){
    category=req.query.category;
  }
  console.log( req.query.category);
  let output;
  let errors = [];
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/news/getnews`);
    if (response.statusCode === 200) {
      if (response.body.status === 'SUCCESS') {

        output = response.body.news;

      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create post. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }

  res.render('admin', { title: 'NEWS', output: output , category:category });
});



router.post('/register', async function (req, res) {
  let body = req.body.new_user;
  let errors = [];
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    }
    catch (err) {
      errors.push(`Unable to parse request body. ${err.message}`);
    }
  }
  let data = {
    name: body.name,
    email: body.email,
    number: body.number,
    role: body.role,
    password: body.password
  }
  try {
    let userAPIResponse = await serviceCall.doServicePostCall(`http://localhost:3000/api/users/add`, data);
  } catch (err) {
    console.log(err);
  }
  res.send({ status: 'SUCCESS' });
});


router.post('/login', async function (req, res) {
  let body = req.body.new_user;
  let errors = [];
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    }
    catch (err) {
      errors.push(`Unable to parse request body. ${err.message}`);
    }
  }
  
  let output;
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/users/getuser`, body);
    if (response.statusCode === 200) {
      if (response.body.status === 'SUCCESS') {
        output = response.body.user;
      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create post. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }
  if(errors.length === 0){
    if(output.length === 0){
     errors.push(" invalid username or password")
    }
  }
  if (errors.length === 0) {
    req.session.user={};
    req.session.user.role=output[0].role;
    req.session.user.name=output[0].name;
    req.session.user._id=output[0]._id;
    res.send({ status: 'SUCCESS', user: output });
    
  } else {
    res.send({ status: "ERROR", errors: errors })
  }
});




router.post('/admin', async function (req, res) {
  let body = req.body;
  body = JSON.parse(body.new_news);
  let errors = [];
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    }
    catch (err) {
      errors.push(`Unable to parse request body. ${err.message}`);
    }
  }
  let data = {
    title: body.title,
    content: body.content,
    date: new Date().getTime(),
    images: body.images,
    filename: body.filename,
    category: body.category
    
  }

  try {

    let newsAPIResponse = await serviceCall.doServicePostCall(`http://localhost:3000/api/news/add`, data);
    if (newsAPIResponse.statusCode === 200) {
      if (newsAPIResponse.body.status === 'SUCCESS') {
      }
      else {
        errors.push(response.body.errors);
      }
    }
  } catch (err) {
    console.log(err);
  }
  if(errors.length === 0){
    res.send({Status:"SUCCESS"});
  }

});


//
router.post('/getnews', async function (req, res) {
  let body = req.body.new_news;
  let errors = [];
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    }
    catch (err) {
      errors.push(`Unable to parse request body. ${err.message}`);
    }
  }

  let output;
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/news/getnews`);
    if (response.statusCode === 200) {
      if (response.body.status === 'SUCCESS') {
        output = response.body.news;
      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create post. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }
  if (errors.length === 0) {
    res.send({ status: 'SUCCESS', news: output });
  } else {
    res.send({ status: "ERROR", errors: errors })
  }
});


router.get('/newspage/:id', async function (req, res) {
  let errors = [];
  let id = req.params.id;

  let news2;
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/news/getnews`,{ id: id });
    if (response.statusCode === 200) {
      if (response.body.status === 'SUCCESS') {
        news2 = response.body.news;
      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create post. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }


  let output;
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/news/getnews`,{ id: id });
    if (response.statusCode === 200) {

      if (response.body.status === 'SUCCESS') {
        output = response.body.news;
      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create post. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }
  let comment ;
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/comment/getcomment`,{newsid:id});
    if (response.statusCode === 200) {
      if (response.body.status === 'SUCCESS') {

        comment = response.body.comment;
     
      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create comment. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }
  if (errors.length === 0) {
    res.render("newspage", { output: output ,comments:comment, id:req.params.id, user:req.session.user.role,name:req.session.user.name,_id:req.session.user._id})
  } else {
    console.log(errors);
  }

})


router.get('/newspages/:id', async function (req, res) {
  let errors = [];
  let id = req.params.id;
  let news1;
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/news/getnews`, { id: id });
    if (response.statusCode === 200) {
      if (response.body.status === 'SUCCESS') {
        news1 = response.body.news;
      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create post. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }


  let output;
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/news/getnews`,{ id: id });
    if (response.statusCode === 200) {

      if (response.body.status === 'SUCCESS') {
        output = response.body.news;
      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create post. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }
  let comment ;
  try {
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/comment/getcomment`,{newsid:id});
    if (response.statusCode === 200) {
      if (response.body.status === 'SUCCESS') {

        comment = response.body.comment;
     
      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create comment. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }
  if (errors.length === 0) {
    res.render("newspages", { output: output ,comments:comment, id:req.params.id})
  } else {
    console.log(errors);
  }

})






router.post('/newspage', async function (req, res) {
  let body = req.body;
  body = JSON.parse(body.new_comment);
  let errors = [];
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    }
    catch (err) {
      errors.push(`Unable to parse request body. ${err.message}`);
    }
  }

  let data = {
    
   
    comment: body.comment,
    date: new Date().getTime(),
 newsid:body.newsid,
 usersid:req.session.user._id

  }
 
  try {
    
    let commentAPIResponse = await serviceCall.doServicePostCall(`http://localhost:3000/api/comment/add`, data);

    if (commentAPIResponse.statusCode === 200) {
      if (commentAPIResponse.body.status === 'SUCCESS') {        
        res.json({Status:"Success"});
      }
      else {
       
        errors.push(commentAPIResponse.body.errors);
      }
    }
  } catch (err) {
    console.log(err);
  }

console.log(errors)
});


//
router.post('/getcomment', async function (req, res) {
 
  let body = req.body.new_comment;
  let errors = [];
  if (typeof body === 'string') {
    try {

      body = JSON.parse(body);
    }
    catch (err) {
      errors.push(`Unable to parse request body. ${err.message}`);
    }
  }

  let output;
  try {
   
   
    let response = await serviceCall.doServicePostCall(`http://localhost:3000/api/comment/getcomment`);
    if (response.statusCode === 200) {
      if (response.body.status === 'SUCCESS') {
        output = response.body.comment;
      }
      else {
        errors.push(response.body.errors);
      }

    }
    else {
      errors.push(`Unable to create comment. Kindly contact administrator.`);
    }
  } catch (err) {
    console.log(err);
  }
  if (errors.length === 0) {
    res.send({ status: 'SUCCESS', comment: output });
  } else {
    res.send({ status: "ERROR", errors: errors })
  }
});

router.get("/attachments", async function (req, res) {
  let folderpath;
  try {
    if (req.query.filename && req.query.filename !== "") {
      if (fs.existsSync(path.join(__dirname, "../attache") + "/" + req.query.filename)) {
        folderpath = '../attache';
        filename = req.query.filename;
      }
    }
    var options = {
      root: path.join(__dirname, folderpath)
    };
    res.sendFile(filename, options);
  }
  catch (ex) {
    console.log(ex);
    res.send({ error: ex });
  }
});



module.exports = router;
