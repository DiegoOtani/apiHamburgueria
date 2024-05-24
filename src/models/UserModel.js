const mongoose = require("mongoose");
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  address: {type: String, required: true},
  password: {type: String, required: true}
});

const UserModel = mongoose.model('User', UserSchema);

class User {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    
    if(this.errors.length > 0) return;

    this.user = await UserModel.findOne({email: this.body.email});

    if(!this.user) {
      this.errors.push('Usuário não encontrado');
      return;
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

  async register() {
    this.valida();
  
    if(this.errors.length > 0) return;

    await this.userExists();

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    this.user = await UserModel.create(this.body);
  }

  async edit(id) {
    if(typeof id !== 'string') return;

    this.valida();

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt)
    
    this.user = await UserModel.findByIdAndUpdate(id, this.body, { new: true });

    if(!this.user) this.errors.push('Usuário não encontrado');
  }

  async delete(id) {
    if (typeof id !== 'string') {
      this.errors.push('ID inválido');
      return;
    }
  
    try {
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        this.errors.push('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      this.errors.push('Erro ao deletar usuário');
      throw error;
    }
  }
  

  async userExists() {
    this.user = await UserModel.findOne({ email: this.body.email});

    if(this.user) this.errors.push('Usuário já existe.');
  }

  valida() {
    this.cleanUp();

    if (!this.body.email || typeof this.body.email !== 'string') {
      this.errors.push('E-mail não fornecido ou inválido');
    } else if (!validator.isEmail(this.body.email)) {
      this.errors.push('E-mail inválido');
    }
  
    if (!this.body.password || typeof this.body.password !== 'string') {
      this.errors.push('Senha não fornecida ou inválida');
    } else if (this.body.password.length < 6 || this.body.password.length > 20) {
      this.errors.push("A senha precisa ter entre 6 e 20 caracteres.");
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') this.body[key] = '';
    }

    this.body = {
      name: this.body.name,
      email: this.body.email,
      address: this.body.address,
      password:this.body.password
    };
  }

  searchUser = async(user) => {
    return await UserModel.find(user);
  };
}

module.exports = User;