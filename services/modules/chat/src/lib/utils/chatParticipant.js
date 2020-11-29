
// eslint-disable-next-line import/prefer-default-export
export const getOtherParticipantEmail = ({ chat, userEmail }) => {
  if (chat.participant1 === userEmail) return chat.participant2;
  return chat.participant1;
};
