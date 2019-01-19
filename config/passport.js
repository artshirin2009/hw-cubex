var passport = require('passport');

var User = require('../models/users');

var LocalStrategy = require('passport-local-roles').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  'local.signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      roleField: 'role',
      passReqToCallback: true
    },

    function(req, email, password, role, done) {
      User.findOne(
        {
          email: email
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, {
              message: 'Email is already in use.'
            });
          }
          if (role == 0 || role == 1) {
            var newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.role = role;
            newUser.save(function(err, result) {
              if (err) {
                return done(err);
              }
              return done(null, newUser);
            });
          } else {
            console.log(role);
            return done(null, false, {
              message: 'Role value should be user or admin'
            });
          }
        }
      );
    }
  )
);

passport.use(
  'local.signin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      roleField: 'role',
      passReqToCallback: true
    },
    function(req, email, password, role, done) {
      User.findOne(
        {
          email: email
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: 'No user with such Email'
            });
          }
          if (!user.validPassword(password)) {
            return done(null, false, {
              message: 'Wrong password'
            });
          }
          if (user) {
            console.log('user exist');
            return done(null, user);
          }
        }
      );
    }
  )
);

// done(1-ошибка-да/нет, 2 - пользователь, обьект)
