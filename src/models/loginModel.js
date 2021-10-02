const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: {type: String, require: true},
    senha: {type: String, require: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login{
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async Login(){
        this.Valida();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user){
            this.errors.push('Usuário não existe.');
            return;
        }

        if(!bcryptjs.compareSync(this.body.senha, this.user.senha)){
            this.errors.push('senha invalida!');
            this.user = null;
            return;
        }
    }


    async Register(){
        this.Valida();

        if(this.errors.length > 0) return;
        
        await this.userExists();

        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.senha = bcryptjs.hashSync(this.body.senha, salt);
        this.user = await LoginModel.create(this.body);
     
    
    }
        //metodo que verifica se já existe email cadastrado na base de dados MongoDB.
        async userExists(){
           this.user = await LoginModel.findOne({ email: this.body.email });
           if(this.user) this.errors.push('usuario já cadastrado!');
        };

    

    Valida(){
        //verifica se é um email valido com o pacote validator.
        this.CleanUp();
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido!');
        if(this.body.senha.length < 3 || this.body.senha.length >50) this.errors.push('A senha tem que estár entre 3 a 50 caracteres.');
       
    }

    CleanUp(){
        //faz uma tratativa para verificar se os dados do formulario não são strings.
        for(const key in this.body){
            if(typeof this.body[key] !== "string") {
                this.body[key] = '';
            }
        }

            this.body = {
                email: this.body.email,
                senha: this.body.senha
            };
    }
}

module.exports = Login;