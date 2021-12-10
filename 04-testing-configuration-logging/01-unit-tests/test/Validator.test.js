const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('string', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      it('[type]', () => {
        const errors = validator.validate({ name: 4 });
  
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });

      it('[min]', () => {
        const errors = validator.validate({ name: 'Lalala' });
  
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });

      it('[max]', () => {
        const errors = validator.validate({ name: 'Lalala-Lalala-Lalala-Lalala' });
  
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 27');
      });
    });

    describe('number', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 65,
        },
      });

      it('[type]', () => {
        const errors = validator.validate({ age: 'lalala' });
  
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      });

      it('[min]', () => {
        const errors = validator.validate({ age: 17});
  
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
      });

      it('[max]', () => {
        const errors = validator.validate({ age: 100});
  
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 65, got 100');
      });
    });
  });
});
