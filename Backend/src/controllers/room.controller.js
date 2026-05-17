const db = require('../config/database');

exports.getAllRooms = async (req, res) => {
  try {
    const { category, lokasi } = req.query;
    let queryText = `
      SELECT r.*, c.name as category_name, u.name as master_name,
      (SELECT COUNT(*) FROM participants p WHERE p.room_id = r.id AND p.status = 'JOINED') as current_participants
      FROM rooms r
      JOIN categories c ON r.category_id = c.id
      JOIN users u ON r.master_id = u.id
    `;
    const queryParams = [];

    if (category || lokasi) {
      queryText += ' WHERE';
      if (category) {
        queryParams.push(category);
        queryText += ` c.name = $${queryParams.length}`;
      }
      if (lokasi) {
        if (category) queryText += ' AND';
        queryParams.push(lokasi);
        queryText += ` r.lokasi_wilayah = $${queryParams.length}`;
      }
    }

    queryText += ' ORDER BY r.created_at DESC';

    const result = await db.query(queryText, queryParams);

    res.status(200).json({
      success: true,
      message: 'Rooms fetched successfully',
      payload: result.rows
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      payload: null
    });
  }
};

exports.createRoom = async (req, res) => {
  try {
    let { category_id, category_name, title, description, lokasi_wilayah, kuota_maksimal, is_private, activity_details } = req.body;
    const master_id = req.user.id;

    if (!category_id && category_name) {
      const catResult = await db.query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1)', [category_name]);
      if (catResult.rows.length > 0) {
        category_id = catResult.rows[0].id;
      } else {
        console.error(`Category not found: ${category_name}`);
        return res.status(400).json({ success: false, message: `Invalid category: ${category_name}` });
      }
    }

    if (!category_id) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    const queryText = `
      INSERT INTO rooms (master_id, category_id, title, description, lokasi_wilayah, kuota_maksimal, is_private, activity_details)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await db.query(queryText, [
      master_id, category_id, title, description, lokasi_wilayah, kuota_maksimal, is_private, JSON.stringify(activity_details || {})
    ]);

    await db.query(
      'INSERT INTO participants (room_id, user_id, status) VALUES ($1, $2, $3)',
      [result.rows[0].id, master_id, 'JOINED']
    );

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      payload: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      payload: null
    });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const queryText = `
      SELECT r.*, c.name as category_name, u.name as master_name,
      (SELECT COUNT(*) FROM participants p WHERE p.room_id = r.id AND p.status = 'JOINED') as current_participants
      FROM rooms r
      JOIN categories c ON r.category_id = c.id
      JOIN users u ON r.master_id = u.id
      WHERE r.id = $1
    `;
    const result = await db.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
        payload: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room details fetched successfully',
      payload: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      payload: null
    });
  }
};
