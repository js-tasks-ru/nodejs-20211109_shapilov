const Validator = require('../Validator');
const expect = require('chai').expect;
const ValidatorSettingsError = require('../ValidatorSettingsError');

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет условия строковых полей', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const validateMinObject = { name: 'Lalala' };
      let errors = validator.validate(validateMinObject);

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too short, expect 10, got ${validateMinObject.name.length}`);

      const validateMaxObject = { name: 'LaLalalaLalalaLalalaLalalaLalalaala' };
      errors = validator.validate(validateMaxObject);
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too long, expect 20, got ${validateMaxObject.name.length}`);

      errors = validator.validate({ name: 123 });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');

      errors = validator.validate({ name: 'Lalalalala' });
      expect(errors).to.have.length(0);
    });

    it('валидатор проверяет условия числовых полей', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      let errors = validator.validate({ age: 9 });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 9');

      errors = validator.validate({ age: 21 });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 21');

      errors = validator.validate({ age: 'Lalala' });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');

      errors = validator.validate({ age: 12 });
      expect(errors).to.have.length(0);
    });

    it('валидатор не проверяет отсутствующие поля', () => {
      let validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      let errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(0);

      validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
        name: {
          type: 'string',
          min: 1,
          max: 20,
        },
      });

      errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(0);
    });

    it('настройки валидатора', () => {
      expect(() => new Validator({
        age: {
          type: 'number',
          min: 10,
        },
      })).to.throw(ValidatorSettingsError);
      expect(() => new Validator({
        age: {
          type: 'Lalala',
          min: 10,
          max: 10,
        },
      })).to.throw(ValidatorSettingsError);
      expect(() => new Validator({
        age: {
          min: 10,
          max: 10,
        },
      })).to.throw(ValidatorSettingsError);
      expect(() => new Validator({
        age: {
          type: 'number',
          max: 10,
        },
      })).to.throw(ValidatorSettingsError);
    });
  });
});