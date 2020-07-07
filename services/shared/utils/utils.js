const crypto = require('crypto');
const { get } = require('deep-object-js');
const env = require('../ms.env');

const isString = arg => typeof arg === 'string';

const isNumber = arg => typeof arg === 'number';

const isUndefined = arg => typeof arg === 'undefined';

const isPositiveNumber = arg => (isNumber(arg) && (arg >= 0));

const strToObj = arg => ((!isString(arg)) ? arg : JSON.parse(arg));

const objToStr = arg => ((isString(arg)) ? arg : JSON.stringify(arg));

const toSqlDateTime = date => new Date(date).toISOString().slice(0, 19).replace('T', ' ');

const lambdaResp = (statusCode, body) => ({ statusCode, ...(body ? { body: objToStr(body) } : '') });

const generateHash = arg => crypto.createHash('md5').update(arg).digest('hex');

const lambdaRespErr = ({
  status, statusCode, stack, error, message,
} = {}) => {
  const body = { error: { message: 'Internal Server Error' } };

  if (error) body.error = error;
  if (!error && message) body.error.message = message;
  if (error && message) body.message = message;

  if (stack && (process.env.DEBUG || process.env.IS_OFFLINE)) body.error.stack = stack;

  return lambdaResp(status || statusCode || 500, body);
};

const error = (statusCode, err) => ({
  statusCode,
  ...(!isString(err) ? { error: err } : { message: err }),
});

const highLevelErrorMessage = message => ({
  message,
  highLevelMessage: true,
});

/**
 * Atribui um valor a um caminho nested de objetos
 * @warning Atribui por referência do objeto a criação dos objetos nested do caminho!!
 * @param {object} obj objeto que deverá conter o valor e o caminho de objetos
 * @param {string|number} path caminho até o valor desejado
 * @param {*} value valor para o ultimo item do caminho
 * @return {undefined}
 */
const set = (obj = {}, path = '', value) => {
  const objects = path.split('.');
  objects.reduce((acc, o, index) => {
    const last = objects.length - 1 === index;

    if (last) {
      if (value === null) return acc;

      acc[o] = value;
      return acc[o];
    }

    if (acc[o]) return acc[o];

    acc[o] = {};

    return acc[o];
  }, obj);
};

const splitCommaSeparatedValues = (...strings) => {
  const stringFiltered = strings.filter(i => i);

  if (stringFiltered.length === 0) return [];

  const separatorRegex = /(;|,)/g;
  const values = {};

  stringFiltered.forEach(i => {
    i.split(separatorRegex).forEach(j => {
      if (!separatorRegex.test(j) && j)
        if (!values[j]) values[j] = '';
    });
  });

  return Object.keys(values);
};

const arrayToSqlString = (arr = []) => `(${arr.map(i => `'${i}'`).join(',')})`;

const isEmail = arg => (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(arg));

const omit = (obj, props) => {
  const newObj = { ...obj };

  props.forEach(val => {
    delete newObj[val];
  });

  return newObj;
};

/**
 * Método criado para utilizar promises
 * com timeout para serem executadas, com
 * async/await de forma facil (é um wrapper)
 */
const setTimeoutPromise = (callback, timeout) => new Promise((resolve, reject) => {
  setTimeout(async () => {
    try {
      const res = await callback();
      return resolve(res);
    } catch (err) {
      reject(err);
    }
  }, timeout);
});

const isObjectEmpty = obj => Object.entries(obj).length === 0 && obj.constructor === Object;

const getIntegrationMessage = ({ statusCode, data, microservice } = {}) => {
  const message = get(data, 'message') || get(data, 'error.message') || get(data, 'error');

  if (statusCode < 299) return message || '';
  return (typeof message === 'string') ? `Integration ${microservice} Error - ${message}` : env.MESSAGE_INTEGRATION_ERROR;
};

const isCnpjCpf = arg => {
  if (!arg) return false;
  if (arg.length === 11) return isCpf(arg);
  if (arg.length === 14) return isCnpj(arg);
  return false;
};

const isCnpj = val => {
  // Captura os primeiros 12 números do CNPJ
  const firstNumbers = val.substr(0, 12);
  // Faz o primeiro cálculo
  const calc1 = calcDigitsPositionsCnpj(firstNumbers, 5);
  // O segundo cálculo é a mesma coisa do primeiro, porém, começa na posição 6
  const calc2 = calcDigitsPositionsCnpj(calc1, 6);
  // Concatena o segundo dígito ao CNPJ
  const cnpj = calc2;
  // Verifica se o CNPJ gerado é idêntico ao enviado
  if (cnpj === val) return true;
  return false;
};

const isCpf = val => {
  // Captura os 9 primeiros dígitos do CPF
  const digits = val.substr(0, 9);
  // Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
  const calc1 = calcDigitsPositionsCpf(digits);
  // Faz o cálculo dos 10 dígitos do CPF para obter o último dígito
  const cpf = calcDigitsPositionsCpf(calc1, 11);
  // Verifica se o CPF gerado é idêntico ao CPF enviado
  if (cpf === val) return true;
  return false;
};

const calcDigitsPositionsCnpj = (digits, positions = 10, sumDigits = 0) => {
  digits = digits.toString();

  for (let i = 0; i < digits.length; i++) {
    sumDigits += (digits[i] * positions);
    positions--;
    if (positions < 2)
      positions = 9;
  }
  sumDigits %= 11;
  if (sumDigits < 2)
    sumDigits = 0;
  else sumDigits = 11 - sumDigits;

  const cnpj = digits + sumDigits;
  return cnpj;
};

const calcDigitsPositionsCpf = (digits, positions = 10, sumDigits = 0) => {
  digits = digits.toString();
  let equalDigits = true;

  for (let i = 0; i < digits.length; i++) {
    if (digits[i] != digits[i - 1] && i != 0)
      equalDigits = false;

    sumDigits += (digits[i] * positions);
    positions--;
  }
  sumDigits %= 11;
  if (sumDigits < 2)
    sumDigits = 0;
  else sumDigits = 11 - sumDigits;

  if (equalDigits) return '0';
  const cpf = digits + sumDigits;
  return cpf;
};

const getObjectTableData = obj => {
  const now = new Date().toISOString();

  const created = !obj;

  const updatedAt = now;
  const createdAt = obj ? obj.createdAt : now;

  return {
    created,
    createdAt,
    updatedAt,
  };
};

module.exports = {
  isString,
  isNumber,
  strToObj,
  objToStr,
  error,
  highLevelErrorMessage,
  lambdaResp,
  lambdaRespErr,
  splitCommaSeparatedValues,
  isUndefined,
  setTimeoutPromise,
  arrayToSqlString,
  isEmail,
  set,
  toSqlDateTime,
  omit,
  isObjectEmpty,
  generateHash,
  getIntegrationMessage,
  isCnpjCpf,
  isCnpj,
  isCpf,
  getObjectTableData,
  isPositiveNumber,
};
