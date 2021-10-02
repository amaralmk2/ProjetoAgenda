exports.middlewareGlobal = (req, res, next) => {
        //variavel local no midleware
        res.locals.errors = req.flash('errors');
        res.locals.success = req.flash('success');
        res.locals.user = req.session.user;
        next();
      };
      
  exports.outroMidleware = (req, res, next) => {
    next();
  };

  exports.csrvError = (error, req, res, next) => {
    if(error) {
      return res.render('erro404');
    }
    next();
  };

  exports.csrfMidlleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  };

  exports.loginRequired = (req,res,next) => {
    if(!req.session.user){
      req.flash('errors', 'você precisa fazer login.');
      req.session.save(() => res.redirect('/'));
      return;
    }
    next();
  };