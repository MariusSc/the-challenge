'use strinct';

function isEmpty(obj) {
  if (obj === null ||
      (typeof obj === 'undefined') ||
      (typeof obj.valueOf() !== 'string') ||
      (obj.trim().length === 0)) {
    return true;
  }
  return false;
}

function isYear(obj) {
  if ((typeof obj === 'undefined') ||
      (typeof obj !== 'number') ||
      !Number.isInteger(obj) ||
      isNaN(obj) ||
      obj <= 0) {
    return false;
  }
  return true;
}

function validateWineObject(wine) {
  var validationResult = {validation: {}};

  if (!wine.hasOwnProperty('name')) {
    validationResult.validation.name = 'MISSING';
  } else if (isEmpty(wine.name)) {
    validationResult.validation.name = 'INVALID';
  }

  if (!wine.hasOwnProperty('year')) {
    validationResult.validation.year = 'MISSING';
  } else if (!isYear(wine.year)) {
    validationResult.validation.year = 'INVALID';
  }

  if (!wine.hasOwnProperty('country')) {
    validationResult.validation.country = 'MISSING';
  } else if (isEmpty(wine.country)) {
    validationResult.validation.country = 'INVALID';
  }

  // API Improvment: Output a meaningful hint to the API user.
  // var typeHint = 'Valid values are \'red\', \'white\' or \'rose\'';
  if (!wine.hasOwnProperty('type')) {
    validationResult.validation.type = 'MISSING';
  } else if (isEmpty(wine.type)) {
    validationResult.validation.type = 'INVALID';
    // validationResult.validation.typeHint = typeHint;
  } else if (wine.type !== 'red' && wine.type !== 'white' && wine.type !== 'rose') {
    validationResult.validation.type = 'INVALID';
    // validationResult.validation.typeHint = typeHint;
  }

  if (Object.keys(validationResult.validation).length > 0) {
    validationResult.error = 'VALIDATION_ERROR';
    return validationResult;
  }

  return null;
}

module.exports = {
  validateWineObject: validateWineObject
};
