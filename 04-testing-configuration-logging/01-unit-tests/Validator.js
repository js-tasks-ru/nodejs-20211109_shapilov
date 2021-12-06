const ValidatorSettingsError = require('./ValidatorSettingsError');

module.exports = class Validator {
  _requiredFields = ['type', 'min', 'max'];
  _supportedType = ['string', 'number'];
  
  constructor(rules) {
    for (const fieldValidate of Object.keys(rules)) {
      let rule = rules[fieldValidate];
      this._requiredFields.forEach(field => {
        if (!rule.hasOwnProperty(field)) {
          throw new ValidatorSettingsError();
        }
        if (field === 'type') {
          if (!this._supportedType.includes(rule[field])) {
            throw new ValidatorSettingsError();
          }
        }
      })
    }
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    for (const field of Object.keys(this.rules)) {
      if (!obj.hasOwnProperty(field)) {
        continue;
      }

      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          }
          if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          }
          if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.max}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};
