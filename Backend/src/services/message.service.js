const { db } = require('../database/drizzle');
const { messages, users } = require('../models/schema');
const { eq, asc } = require('drizzle-orm');
const pusher = require('../config/pusher');

class MessageService {
  async getMessagesByRoomId(roomId) {
    return await db.select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      user: {
        id: users.id,
        name: users.name,
        image: users.image
      }
    })
    .from(messages)
    .innerJoin(users, eq(messages.userId, users.id))
    .where(eq(messages.roomId, roomId))
    .orderBy(asc(messages.createdAt));
  }

  async createMessage(roomId, userId, content) {
    const [newMessage] = await db.insert(messages).values({
      roomId,
      userId,
      content
    }).returning();

    const [user] = await db.select({
      id: users.id,
      name: users.name,
      image: users.image
    }).from(users).where(eq(users.id, userId));

    const messageWithUser = { ...newMessage, user };

    // Trigger Pusher event
    pusher.trigger(`room-${roomId}`, "new-message", messageWithUser);

    return messageWithUser;
  }
}

module.exports = new MessageService();
