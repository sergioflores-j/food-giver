import { v4 as uuid } from 'uuid';
import ChatDao from '@shared/dao/ChatDao';

export const createOrUpdateChat = async ({
  participant1,
  participant2,
}) => {
  try {
    const [existentChat] = await new ChatDao().query({
      participant1,
      participant2,
    });

    if (existentChat) {
      const updated = await new ChatDao().updateControlFields({ chatId: existentChat.chatId });
      return { ...existentChat, ...updated };
    }

    const newChat = await createChat({ participant1, participant2 });

    return newChat;
  } catch (err) {
    console.log('createOrUpdateChat err', err);
    throw err;
  }
};

export const createChat = async ({ participant1, participant2 }) => {
  const now = new Date().toISOString();

  return new ChatDao().create({
    chat: {
      chatId: uuid(),
      participant1,
      participant2,
      activeSocket: {},
      createdAt: now,
      updatedAt: now,
    },
  });
};
