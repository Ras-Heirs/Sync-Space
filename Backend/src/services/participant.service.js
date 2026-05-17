const { db } = require('../database/drizzle');
const { participants, rooms, users } = require('../models/schema');
const { eq, and, count, sql } = require('drizzle-orm');

class ParticipantService {
  async joinRoom(roomId, userId) {
    // Get room details
    const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId));
    if (!room) throw new Error('Room not found');
    if (room.status === 'CLOSED') throw new Error('Room is closed');

    // Check if already joined
    const [existing] = await db.select()
      .from(participants)
      .where(and(eq(participants.roomId, roomId), eq(participants.userId, userId)));
    
    if (existing) {
      if (existing.status === 'JOINED') throw new Error('Already a participant');
      if (existing.status === 'PENDING') throw new Error('Request already pending');
      if (existing.status === 'REJECTED') {
        // Allow re-requesting if rejected? For now let's just allow it or keep it rejected.
        // Let's allow re-requesting by updating the status back to PENDING.
        const [updated] = await db.update(participants)
          .set({ status: room.isPrivate ? 'PENDING' : 'JOINED' })
          .where(eq(participants.id, existing.id))
          .returning();
        return updated;
      }
    }

    // Check capacity
    const [participantCount] = await db.select({ 
      value: count() 
    }).from(participants).where(and(eq(participants.roomId, roomId), eq(participants.status, 'JOINED')));
    
    if (participantCount.value >= room.maxCapacity) {
      throw new Error('Room is full');
    }

    // Determine status based on privacy
    const initialStatus = room.isPrivate ? 'PENDING' : 'JOINED';

    const [newParticipant] = await db.insert(participants).values({
      roomId,
      userId,
      status: initialStatus,
    }).returning();

    // Trigger Pusher for Master if PENDING
    if (initialStatus === 'PENDING') {
      const pusher = require('../config/pusher');
      pusher.trigger(`user-${room.masterId}`, 'request-update', {
        type: 'NEW_REQUEST',
        roomId: room.id,
        roomTitle: room.title,
        participant: newParticipant
      });
    }

    return newParticipant;
  }

  async leaveRoom(roomId, userId) {
    // Cannot leave if you are the master (you should close the room instead)
    const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId));
    if (room && room.masterId === userId) {
      throw new Error('Room master cannot leave. Close the room instead.');
    }

    await db.delete(participants)
      .where(and(eq(participants.roomId, roomId), eq(participants.userId, userId)));
    
    return true;
  }

  async updateParticipantStatus(participantId, masterId, status) {
    // Verify master ownership
    const [participant] = await db.select().from(participants).where(eq(participants.id, participantId));
    if (!participant) throw new Error('Participant request not found');

    const [room] = await db.select().from(rooms).where(eq(rooms.id, participant.roomId));
    if (room.masterId !== masterId) throw new Error('Only room master can approve/reject requests');

    // Update status
    const [updated] = await db.update(participants)
      .set({ status })
      .where(eq(participants.id, participantId))
      .returning();

    // Trigger Pusher for User
    const pusher = require('../config/pusher');
    pusher.trigger(`user-${participant.userId}`, 'request-update', {
      type: 'STATUS_UPDATED',
      roomId: room.id,
      roomTitle: room.title,
      status: status
    });

    return updated;
  }

  async getParticipants(roomId) {
    return await db.select({
      id: participants.id,
      roomId: participants.roomId,
      userId: participants.userId,
      status: participants.status,
      joinedAt: participants.joinedAt,
      userName: users.name,
      userImage: users.image,
      userEmail: users.email
    })
    .from(participants)
    .leftJoin(users, eq(participants.userId, users.id))
    .where(eq(participants.roomId, roomId));
  }
}

module.exports = new ParticipantService();
