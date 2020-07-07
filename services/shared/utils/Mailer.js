const AWS = require('aws-sdk');
const { error } = require('./utils');

module.exports = class Mailer {
  /**
   * @prop {Object} obj
   * @prop {string} obj.html - corpo do email
   * @prop {string} obj.subject - assunto do email
   * @prop {string} obj.from - quem envia
   * @prop {array} obj.to - para quem envia
   * @prop {array} obj.replyTo - para quem será a resposta (opcional)
   * @prop {array} obj.bccAddresses - quem recebe cópia oculta (opcional)
   */
  constructor({
    html,
    subject,
    from,
    to = [],
    replyTo = [],
    bccAddresses = [],
  } = {}) {
    /**
     * Atributos de parâmetros
     */
    this._html = html;
    this._from = from;
    this._to = to;
    this._replyTo = replyTo;
    this._subject = subject;
    this._bccAddresses = bccAddresses;

    /**
     * Validação dos parametros obrigatorios
     */
    this._checkParameters();

    this._ses = new AWS.SES({ region: 'us-east-1' });
  }

  send() {
    return new Promise((resolve, reject) => {
      this._ses.sendEmail({
        Destination: {
          ToAddresses: this._to,
          BccAddresses: this._bccAddresses,
        },
        Message: {
          Body: {
            Html: {
              Data: this._html,
            },
          },
          Subject: {
            Data: this._subject,
          },
        },
        Source: this._from,
      }, err => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  static bodyTemplate(message, user) {
    return `
      <body style="background:#fff; padding:0 20px; color:#555; font-family: Arial, Helvetica, sans-serif; font-weight:200;">
        <h2>Olá.</h2>
        <div>${message}</div>
        <p>Qualquer dúvida estamos a disposição.</p>
        <p>Att.</p>
        ${user}
      </body>
    `;
  }

  /**
   * @private
   * Faz a checagem para saber se a classe
   * recebeu todos os dados do API Gateway
   */
  _checkParameters() {
    try {
      const errors = {};

      if (!this._html) errors.html = 'undefined';

      if (!this._from) errors.from = 'undefined';

      if (!this._to) errors.to = 'undefined';
      else if (!Array.isArray(this._to)) errors.to = 'is not array';
      else if (this._to.length === 0) errors.to = 'is empty';

      if (this._replyTo && !Array.isArray(this._replyTo)) errors.replyTo = 'is not array';

      if (!this._subject) errors.subject = 'undefined';

      if (this._bccAddresses && !Array.isArray(this._bccAddresses)) errors.bccAddresses = 'is not array';

      if (Object.keys(errors).length > 0) throw error(400, errors);
    } catch (err) {
      throw err;
    }
  }
};
