// @ts-check
import { error, isEmail } from '@shared/utils/utils';
import { isObject } from 'deep-object-js';
import env from '@root/ms.env';

import UserDao from '@shared/dao/UserDao';

export default class CreateUser {
  /**
   * 
   * @param {object} param0 
   * @param {import('../../../../../types/User').User} param0.user 
   */
  constructor({ user }) {
    this.user = user;
    this._checkParameters();
  }
 
  async run() {
    try {
      // TODO: validar objeto do user

      const userItem = {
        ...this.user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await new UserDao().create({ user: userItem });

      return { user: userItem };
    } catch (err) {
      console.log('Error CreateUser Run', err);
      console.log('Params: ', {
        user: this.user,
      });
      throw err;
    }
  }

  _checkParameters() {
    const errors = {};

    if (!this.user) errors.user = 'undefined';
    else if (!isObject(this.user)) errors.user = 'is not an object';
    else if (!this.user.email) errors.userEmail = 'undefined';
    else if (!isEmail(this.user.email)) errors.userEmail = 'is not a valid email';
    
    if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
  }
}
