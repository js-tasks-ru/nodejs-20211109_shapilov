class ValidatorSettingsError extends Error {
  constructor() {
    super('Validator settings error');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    this.code = 'VALIDATOR_SETTINGS';
  }
}

module.exports = ValidatorSettingsError;