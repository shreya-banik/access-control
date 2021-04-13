const express= require('express');
const router= express.Router();

//Bring the article models
let Article = require('../models/article');

//user model
Let User=require('../models/user');

//Add Route
router.get('/add',ensureAuthenticated, function(req, res){
  res.render('add_articles',{
    title:'Add Articles'
  });
});

// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
//  req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();
  //console.log('Form is Submitted!!');
  //console.log(req.body.f_name);
  //get Errors
let errors=req.validationErrors();

if(errors){
  res.render('add_article',{
    title: 'Add articles',
    errors: errors
  });
}else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
      } else {
        req.flash('success','Article updated')
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    if(article.author!=req.user._id){
      req.flash('danger','Not authorized');
      res.redirect('/');
    }
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});


// Update Submit POST Route
route.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

//delete articles

router.delete('/:id', function(req, res){
  if(!req.user_id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  if (article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
          res.send('Success');
      });
    }
  });
});

//Get Single Article
router.get('/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author,function(err,user){
      res.render('article',{
        article:user.name
      });
    });
  });
});

//access controls
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}
module.exports= router;
