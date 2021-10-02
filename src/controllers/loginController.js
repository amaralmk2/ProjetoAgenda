    const Login = require('../models/loginModel');

    exports.index = (req,res) => {
        if(req.session.user) return res.render('login-logado');
        return res.render('login');
        
    };
    
    exports.register = async function(req,res) {

        try{
       
        const login = new Login(req.body);
        await login.Register();
    
        if(login.errors.length > 0){
        req.flash('errors', login.errors);  
        req.session.save(function() {
        return res.redirect('back');
    });
                return;
            }

            req.flash('success', "login efetuado com sucesso!");  
            req.session.save(function() {
            return res.redirect('back');
             });

        }
        catch(e){
            console.log(e);
           return res.render('erro404');
        }
    };

    exports.login = async function(req,res) {

        try{
       
        const login = new Login(req.body);
        await login.Login();
    
        if(login.errors.length > 0){
        req.flash('errors', login.errors);  
        req.session.save(function() {
        return res.redirect('back');
    });
                return;
            }

            req.flash('success', "você entrou no sistema!");  
            req.session.user = login.user;
            req.session.save(function() {
            return res.redirect('back');
             });

        }
        catch(e){
            console.log(e);
           return res.render('erro404');
        }
    };

    exports.logout = (req,res) => {
        req.session.destroy();
        res.redirect('/');
    }
  
    