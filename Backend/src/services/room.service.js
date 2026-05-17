const { db } = require('../database/drizzle');
const { rooms, participants, categories } = require('../models/schema');
const { eq, and, or, ilike, sql, gte, lte, desc } = require('drizzle-orm');
const { AppError } = require('../middleware/errorHandler');

class RoomService {
  async resolveCategoryId(categoryName) {
    const [category] = await db.select().from(categories).where(ilike(categories.name, categoryName));
    return category ? category.id : null;
  }

  async createRoom(roomData) {
    let categoryId = roomData.categoryId;
    
    if (!categoryId && roomData.categoryName) {
      categoryId = await this.resolveCategoryId(roomData.categoryName);
      if (!categoryId) {
        throw new AppError(`Kategori tidak valid: ${roomData.categoryName}`, 400);
      }
    }

    if (!categoryId) {
      throw new AppError('Kategori wajib diisi', 400);
    }

    const [newRoom] = await db.insert(rooms).values({
      masterId: roomData.masterId,
      categoryId: categoryId,
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
    const participantCountSubquery = db
      .select({ 
        roomId: participants.roomId, 
        count: sql`count(*)`.as('count') 
      })
      .from(participants)
      .where(eq(participants.status, 'JOINED'))
      .groupBy(participants.roomId)
      .as('pc');

    let query = db.select({
      id: rooms.id,
      masterId: rooms.masterId,
      categoryId: rooms.categoryId,
      title: rooms.title,
      description: rooms.description,
      region: rooms.region,
      maxCapacity: rooms.maxCapacity,
      isPrivate: rooms.isPrivate,
      status: rooms.status,
      activityDetails: rooms.activityDetails,
      createdAt: rooms.createdAt,
      categoryName: categories.name,
      currentParticipants: sql`COALESCE(${participantCountSubquery.count}, 0)`.mapWith(Number),
    })
    .from(rooms)
    .leftJoin(categories, eq(rooms.categoryId, categories.id))
    .leftJoin(participantCountSubquery, eq(rooms.id, participantCountSubquery.roomId));
    
    const conditions = [];
    
    if (filters.search) {
      conditions.push(
        or(
          ilike(rooms.title, `%${filters.search}%`),
          ilike(rooms.description, `%${filters.search}%`)
        )
      );
    }

    if (filters.region) conditions.push(eq(rooms.region, filters.region));
    if (filters.categoryId) conditions.push(eq(rooms.categoryId, filters.categoryId));
    if (filters.categoryName) {
      const catId = await this.resolveCategoryId(filters.categoryName);
      if (catId) conditions.push(eq(rooms.categoryId, catId));
    }
    
    if (filters.isPrivate !== undefined) conditions.push(eq(rooms.isPrivate, filters.isPrivate === 'true'));
    if (filters.minCapacity) conditions.push(gte(rooms.maxCapacity, parseInt(filters.minCapacity)));
    if (filters.startDate) conditions.push(gte(rooms.createdAt, new Date(filters.startDate)));
    if (filters.endDate) conditions.push(lte(rooms.createdAt, new Date(filters.endDate)));
    
    if (filters.status) {
      conditions.push(eq(rooms.status, filters.status));
    } else {
      conditions.push(eq(rooms.status, 'OPEN'));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(rooms.createdAt));
  }

  async getRoomById(id) {
    const participantCountSubquery = db
      .select({ 
        roomId: participants.roomId, 
        count: sql`count(*)`.as('count') 
      })
      .from(participants)
      .where(eq(participants.status, 'JOINED'))
      .groupBy(participants.roomId)
      .as('pc');

    const [room] = await db.select({
      id: rooms.id,
      masterId: rooms.masterId,
      categoryId: rooms.categoryId,
      title: rooms.title,
      description: rooms.description,
      region: rooms.region,
      maxCapacity: rooms.maxCapacity,
      isPrivate: rooms.isPrivate,
      status: rooms.status,
      activityDetails: rooms.activityDetails,
      createdAt: rooms.createdAt,
      categoryName: categories.name,
      currentParticipants: sql`COALESCE(${participantCountSubquery.count}, 0)`.mapWith(Number),
    })
    .from(rooms)
    .leftJoin(categories, eq(rooms.categoryId, categories.id))
    .leftJoin(participantCountSubquery, eq(rooms.id, participantCountSubquery.roomId))
    .where(eq(rooms.id, id));
    
    return room;
  }
}

module.exports = new RoomService();
