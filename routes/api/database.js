const MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
const uri = "mongodb+srv://Dhanesh:Prahi%402016@cluster0.nsbya.mongodb.net/news-db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

let userCollections,newsCollections,commentCollections;

module.exports.init = function() {
    return new Promise((resolve, reject) => {
		client.connect(err => {
			if (err) {
				reject(err);
			}
			else {
				userCollections = client.db(process.env.dbName).collection("users");
                newsCollections = client.db(process.env.dbName).collection("news");
                commentCollections = client.db(process.env.dbName).collection("comment");
				resolve(true);
			}
		});
	});
}

module.exports.addUser = function(document) {
    return new Promise((resolve, reject) => {
        userCollections.insert(document).then(function(value) {
            return resolve(value);
        }).catch(function(err) {
            return reject(err);
        });
    });
}


module.exports.getUser = function(searchCriteria) {
    if (searchCriteria._id) {
        searchCriteria._id = new mongo.ObjectID(searchCriteria._id);
    } 
    return new Promise((resolve, reject) => {
        userCollections.find(searchCriteria).toArray().then(function(value) {
            return resolve(value);
        }).catch(function(err) {
            return reject(err);
        });
    });
}

module.exports.addNews = function(document) {
    return new Promise((resolve, reject) => {
        newsCollections.insert(document).then(function(value) {
            return resolve(value);
        }).catch(function(err) {
            console.log(err)
            return reject(err);
        });
    });
}


module.exports.getNews = function(searchCriteria) {
    if (searchCriteria._id) {
        searchCriteria._id = new mongo.ObjectID(searchCriteria._id);
    } 
    return new Promise((resolve, reject) => {
        newsCollections.find(searchCriteria).sort({date:-1}).toArray().then(function(value) {
            return resolve(value);
        }).catch(function(err) {
            return reject(err);
        });
    });
}



module.exports.addComment = function(document) {
    if (document.newsid) {
        document.newsid = new mongo.ObjectID(document.newsid);
    }
    if (document.usersid) {
        document.usersid = new mongo.ObjectID(document.usersid);
    }
    return new Promise((resolve, reject) => {
        commentCollections.insertOne(document).then(function(value) {
            return resolve(value);
        }).catch(function(err) {
            console.log(err)
            return reject(err);
        });
    });
}


module.exports.getComment = function(searchCriteria) {

    if (searchCriteria.newsid) {
        searchCriteria.newsid = new mongo.ObjectID(searchCriteria.newsid);
    } 
    if (searchCriteria.usersid) {
        searchCriteria.usersid = new mongo.ObjectID(searchCriteria.usersid);
    } 
    return new Promise((resolve, reject) => {
        let aggr=[
			{
				"$match":searchCriteria
			},{
				'$lookup': {
					'from': 'users',
					'localField': 'usersid',
					'foreignField': '_id',
					'as': 'user_details'
				}
			}
		]
        commentCollections.aggregate(aggr).sort({date:-1}).toArray().then(function(value) {
            return resolve(value);
        }).catch(function(err) {
            return reject(err);
        });
    });
}