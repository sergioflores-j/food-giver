const formatCpf = cpf => {
  let formatedCpf = cpf;

  if (!formatedCpf) formatedCpf = '';

  formatedCpf = formatedCpf.replace(/\D/g, '');
  formatedCpf = formatedCpf.replace(/(\d{3})(\d)/, '$1.$2');
  formatedCpf = formatedCpf.replace(/(\d{3})(\d)/, '$1.$2');
  formatedCpf = formatedCpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return formatedCpf;
};

const formatCnpj = cnpj => {
  let formatedCnpj = cnpj;
  
  if (!cnpj) formatedCnpj = '';

  formatedCnpj = formatedCnpj.replace(/\D/g, '');
  formatedCnpj = formatedCnpj.replace(/^(\d{2})(\d)/, '$1.$2');
  formatedCnpj = formatedCnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  formatedCnpj = formatedCnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
  formatedCnpj = formatedCnpj.replace(/(\d{4})(\d)/, '$1-$2');
  return formatedCnpj;
};

const formatCnpjCpf = arg => {
  if (!arg) return '';

  if (arg.length === 11)
    return formatCpf(arg);
  if (arg.length === 14)
    return formatCnpj(arg);
       
  return arg;
};

const formatCep = cep => {
  let formatedCep = cep;
  if (!cep) formatedCep = '';

  formatedCep = formatedCep.replace(/\D/g, '');
  formatedCep = formatedCep.replace(/^(\d{5})(\d)/, '$1-$2');
  return formatedCep;
};

const formatPhone = phone => {
  let formatedPhone = phone;
  if (!phone) formatedPhone = '';

  formatedPhone = formatedPhone.replace(/\D/g, '');
  if (formatedPhone.length === 11) {
    formatedPhone = formatedPhone.replace(/(\d{2})(\d)/, '($1) $2');
    formatedPhone = formatedPhone.replace(/(\d{5})(\d)/, '$1-$2');
  } else if (formatedPhone.length === 10) {
    formatedPhone = formatedPhone.replace(/(\d{2})(\d)/, '($1) $2');
    formatedPhone = formatedPhone.replace(/(\d{4})(\d)/, '$1-$2');
  } else if (formatedPhone.length === 9) {
    formatedPhone = formatedPhone.replace(/(\d{5})(\d)/, '$1-$2');
  } else if (formatedPhone.length === 8) {
    formatedPhone = formatedPhone.replace(/(\d{4})(\d)/, '$1-$2');
  }
  return formatedPhone;
};

const formatCurrency = (value = 0, removePrefix) => {
  let newValue = 0;

  if ((value && !Number.isNaN(Number(value))) || value === 0) newValue = value;

  const [int, decimal] = String(newValue).split('.');

  const positions = [];

  for (let i = 1; i < int.length; i++) if (i % 3 === 0) positions.push(i);

  let resultString = int;
  positions.forEach((p, index) => {
    const pos = p + index;
    const newString = `${resultString.slice(0, -pos)}.${resultString.slice(-pos)}`;
    resultString = newString;
  });

  return `${!removePrefix ? 'R$ ' : ''}${resultString},${(decimal || '').padEnd(2, '0')}`;
};


module.exports = {
  formatCnpj,
  formatCpf,
  formatCep,
  formatPhone,
  formatCurrency,
  formatCnpjCpf,
};
