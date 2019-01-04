

var auth = require('./auth');
var AccMd = require('../models/accModel').accouts;
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
var GoogleStrategy = require('passport-google-oauth2').Strategy;
module.exports = (passport) => {
    passport.serializeUser(function (acc, done) {
        done(null, acc.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        AccMd.findById(id, function (err, acc) {
            done(err, acc);
        });
    });
    passport.use(new GoogleStrategy({
        clientID:     auth.googleClientID,
        clientSecret: auth.googleClientSecret,
        callbackURL: "http://localhost:3000/admin/auth/google/callback"
        
      },
      function(request, accessToken, refreshToken, profile, done) {
                    
                   
                  
                    
                   if(profile.id) {
                            AccMd.findOne({userID:profile.id}).then((exit)=>{
                                if(exit) {
                                  done(null,exit)
                                      
                                  done(null,exit)
                                  if(Number(exit.userID) ==113713183499667010000){
                                     await AccMd.findOneAndUpdate({userID : exit.userID},{role : 'admin'})
                                  }
                                }else{
                                    var info
                                    var img = profile.photos[0].value
                                    var image = img.replace("?sz=50","") 

                                    if(Number(profile.id) == 113713183499667010000){
                                        var info = {
                                            role :'admin',
                                            userID : profile.id,
                                            email: profile.email,
                                            displayName: profile.displayName,
                                            image : image
                                            
                                    }
                                    }else{
                                        var info = {
                                            role :'user',
                                            userID : profile.id,
                                            email: profile.email,
                                            displayName: profile.displayName,
                                            image : image
                                            
                                    }
                                    }
                                    
                                    var dulieu = AccMd(info)
                                    .save()
                                    .then((acc) => {
                                       done(null,acc);
                                        
                                    })
                                    
                                }
                            })
                    

                   
                   }
       
      }
    ));

}