module.exports = function(app, passport) {


var mongoose = require('mongoose');
        var db = require('../config/database.js');
        
        var Schema = mongoose.Schema;
         var imageSchema = new Schema({
                title: String,
                user: String,
                imgUrl: String,
         });
         

        var image = mongoose.model('images', imageSchema);
        
        
	app.get('/',
  function(req, res) {
    res.render('login', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/twitter',
  passport.authenticate('twitter'));

app.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile', isLoggedIn, function(req, res) {
        image.find({user: req.user.id}, function(err, data) {
        
        res.render('profile.ejs', {
            images: data,
            user: req.user
            // get the user out of session and pass to template
        });
        });
    });
    
    app.get('/recent', isLoggedIn, function(req, res) {
        image.find({}, function(err, data) {
        
        res.render('recent.ejs', {
            images: data,
            user: req.user
            // get the user out of session and pass to template
        });
        });
    });
    
    app.get('/remove/:id', isLoggedIn, function(req, res) {
        image.findByIdAndRemove(req.params.id, function(err) {
            return (err);
        });
        res.redirect('/profile');
    })
    
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    app.get('/add', function(req, res) {
        var imgUrl = req.query.url;
        var title = req.query.title;
        var user = req.user.id;
        
        setTimeout(function() {
        
        var newImage = new image({
            "title" : title,
            "imgUrl": imgUrl,
            "user": user,
            "likes": []
        });
        newImage.save(function(err) {
                    if (err)
                        throw err;
                    return newImage;
                });
        
        res.redirect("/profile");
}, 1000);
    })
    
    app.get('/auth/twitter', passport.authenticate('twitter'));
    
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));
        
        
        function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
}