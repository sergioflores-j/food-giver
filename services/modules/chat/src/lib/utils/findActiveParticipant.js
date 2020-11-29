/**
 *
 * @returns {{ participant: string; otherParticipant: string }}
 */
export const findByConnectionId = ({ connectionId, activeSocket }) => {
  const activeSocketKeys = Object.keys(activeSocket);

  console.log('activeSocketKeys', activeSocketKeys);

  // ? Find the participant who has this connectionId
  const participant = activeSocketKeys.find(k => activeSocket[k].connectionId === connectionId);
  // ? Find the participant who doesn't has this connectionId
  const otherParticipant = activeSocketKeys.find(k => activeSocket[k].connectionId !== connectionId);

  return {
    participant,
    otherParticipant,
  };
};

/**
 * @returns {{
 *  participant: import('../../../../../../types/Chat').Chat['activeSocket'][''];
 *  otherParticipant: import('../../../../../../types/Chat').Chat['activeSocket'][''];
 * }}
 */
export const findByEmail = ({ userEmail, activeSocket }) => {
  const otherParticipant = Object.keys(activeSocket)
    .find(k => k !== userEmail);

  return {
    participant: activeSocket[userEmail],
    otherParticipant: (
      otherParticipant && activeSocket[otherParticipant]
        ? {
          ...activeSocket[otherParticipant],
          userEmail: otherParticipant,
        }
        : undefined
    ),
  };
};
