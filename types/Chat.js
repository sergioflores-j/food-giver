/**
 * @typedef {Object} Chat
 * @property {string} chatId
 * @property {string} participant1
 * @property {string} participant2
 * @property {{
 *  [userEmail: string]: {
 *    userEmail: string;
 *    connectionId: string;
 *    connectedAt: number;
 *  }
 * }} [activeSocket]
 * @property {string} [connectionId1]
 * @property {string} [connectionId2]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

module.exports = {};
