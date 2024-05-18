const pool = require('../db/conn')

class User {
    constructor(id, name, email, password, image, phone) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.image = image;
      this.phone = phone;
    }
  
    // Métodos para manipular dados do usuário
    getId() {
      return this.id;
    }
  
    getName() {
      return this.name;
    }
  
    getEmail() {
      return this.email;
    }
  
    getPassword() {
      return this.password;
    }
  
    getImage() {
      return this.image;
    }
  
    getPhone() {
      return this.phone;
    }
  
  }
  
  module.exports = User;