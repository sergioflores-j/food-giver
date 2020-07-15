const _calcDigitsPositionsCnpj = (digits, positions = 10, sumDigits = 0) => {
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

const _calcDigitsPositionsCpf = (digits, positions = 10, sumDigits = 0) => {
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

export const isCnpj = val => {
  // Captura os primeiros 12 números do CNPJ
  const firstNumbers = val.substr(0, 12);
  // Faz o primeiro cálculo
  const calc1 = _calcDigitsPositionsCnpj(firstNumbers, 5);
  // O segundo cálculo é a mesma coisa do primeiro, porém, começa na posição 6
  const calc2 = _calcDigitsPositionsCnpj(calc1, 6);
  // Concatena o segundo dígito ao CNPJ
  const cnpj = calc2;
  // Verifica se o CNPJ gerado é idêntico ao enviado
  if (cnpj === val) return true;
  return false;
};

export const isCpf = val => {
  // Captura os 9 primeiros dígitos do CPF
  const digits = val.substr(0, 9);
  // Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
  const calc1 = _calcDigitsPositionsCpf(digits);
  // Faz o cálculo dos 10 dígitos do CPF para obter o último dígito
  const cpf = _calcDigitsPositionsCpf(calc1, 11);
  // Verifica se o CPF gerado é idêntico ao CPF enviado
  if (cpf === val) return true;
  return false;
};

export const isCpfCnpj = arg => {
  if (!arg) return false;
  if (arg.length === 11) return isCpf(arg);
  if (arg.length === 14) return isCnpj(arg);
  return false;
};

export const isEmail = arg => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(arg);

export const isPhone = arg => arg && (arg.length === 11 || arg.length === 10);
