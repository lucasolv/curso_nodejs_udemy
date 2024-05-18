const pool = require('../db/conn')

class Pet {
    constructor(id, name, age, weight, color, images, available,user) {
      this.id = id;
      this.name = name;
      this.age = age;
      this.weight = weight;
      this.color = color;
      this.images = images;
      this.availeble = available;
      this.user = user;
    }
  
    // Métodos para manipular dados do usuário
    getId() {
      return this.id;
    }
  
    getName() {
      return this.name;
    }
  
    getAge() {
      return this.age;
    }
  
    getWeight() {
      return this.weight;
    }
  
    getColor() {
      return this.color;
    }
  
    getImages() {
      return this.images;
    }
  
    getAvailable() {
      return this.available;
    }
  
    getUser() {
      return this.user;
    }
  
  }
  
  module.exports = Pet;