export const formatDateTime = date => Intl.DateTimeFormat('pt-BR', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
}).format(new Date(date));

export const formatPhone = phone => {
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

export const formatCep = cep => {
  let formatedCep = cep;
  if (!cep) formatedCep = '';

  formatedCep = formatedCep.replace(/\D/g, '');
  formatedCep = formatedCep.replace(/^(\d{5})(\d)/, '$1-$2');
  return formatedCep;
};
