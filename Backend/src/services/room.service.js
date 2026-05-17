const { db } = require('../database/drizzle');
const { rooms, participants, categories } = require('../models/schema');
const { eq, and, or, ilike, sql, gte, lte } = require('drizzle-orm');

class RoomService {
  async createRoom(roomData) {
    const [newRoom] = await db.insert(rooms).values({
      masterId: roomData.masterId,
      categoryId: roomData.categoryId,
      title: roomData.title,
      description: roomData.description,
      region: roomData.region,
      maxCapacity: roomData.maxCapacity,
      isPrivate: roomData.isPrivate || false,
      activityDetails: roomData.activityDetails || {},
    }).returning();
    
    // Automatically add master as a JOINED participant
    await db.insert(participants).values({
      roomId: newRoom.id,
      userId: roomData.masterId,
      status: 'JOINED',
    });

    return newRoom;
  }

  async getAllRooms(filters = {}) {
    let query = db.select().from(rooms);
    
    const conditions = [];
    
    // Enhanced Text Search (Prioritizing details in description)
    if (filters.search) {
      conditions.push(
        or(
          ilike(rooms.title, `%${filters.search}%`),
          ilike(rooms.description, `%${filters.search}%`)
        )
      );
    }

    // Advanced Filters
    if (filters.region) conditions.push(eq(rooms.region, filters.region));
    if (filters.categoryId) conditions.push(eq(rooms.categoryId, filters.categoryId));
    if (filters.isPrivate !== undefined) conditions.push(eq(rooms.isPrivate, filters.isPrivate === 'true'));
    
    // Capacity filtering (find rooms that can fit X people)
    if (filters.minCapacity) conditions.push(gte(rooms.maxCapacity, parseInt(filters.minCapacity)));

    // Date range filtering
    if (filters.startDate) conditions.push(gte(rooms.createdAt, new Date(filters.startDate)));
    if (filters.endDate) conditions.push(lte(rooms.createdAt, new Date(filters.endDate)));
    
    // Status management
    if (filters.status) {
      conditions.push(eq(rooms.status, filters.status));
    } else {
      conditions.push(eq(rooms.status, 'OPEN'));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(rooms.createdAt);
  }

  async getRoomById(id) {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }

  async getSuggestedRooms(user, overrideCategoryId = null) {
    const { domicile, hobbies } = user;
    
    let query = db.select({
      room: rooms,
      categoryName: categories.name,
    })
    .from(rooms)
    .innerJoin(categories, eq(rooms.categoryId, categories.id))
    .where(
      and(
        eq(rooms.region, domicile),
        eq(rooms.status, 'OPEN')
      )
    );

    if (overrideCategoryId) {
      query = query.where(eq(rooms.categoryId, overrideCategoryId));
    }

    const isSuggested = sql`CASE WHEN ${categories.name} = ANY(${hobbies || []}) THEN 1 ELSE 0 END`;

    return await query.orderBy(sql`${isSuggested} DESC`, rooms.createdAt);
  }
}

module.exports = new RoomService();
