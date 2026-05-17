const db = require('../config/database');

exports.joinRoom = async (req, res) => {
  try {
    const { room_id } = req.body;
    const user_id = req.user.id;

    const roomResult = await db.query(
      `SELECT r.*, 
      (SELECT COUNT(*) FROM participants p WHERE p.room_id = r.id AND p.status = 'JOINED') as current_participants
      FROM rooms r WHERE r.id = $1`,
      [room_id]
    );

    if (roomResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const room = roomResult.rows[0];
    if (room.current_participants >= room.kuota_maksimal) {
      return res.status(400).json({ success: false, message: 'Room is full' });
    }

    const status = room.is_private ? 'PENDING' : 'JOINED';

    const queryText = `
      INSERT INTO participants (room_id, user_id, status)
      VALUES ($1, $2, $3)
      ON CONFLICT (room_id, user_id) DO UPDATE SET status = EXCLUDED.status
      RETURNING *
    `;
    const result = await db.query(queryText, [room_id, user_id, status]);

    res.status(201).json({
      success: true,
      message: room.is_private ? 'Join request sent' : 'Joined room successfully',
      payload: result.rows[0]
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const master_id = req.user.id;

    const participantResult = await db.query(
      `SELECT p.*, r.master_id FROM participants p JOIN rooms r ON p.room_id = r.id WHERE p.id = $1`,
      [id]
    );

    if (participantResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (participantResult.rows[0].master_id !== master_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const queryText = `UPDATE participants SET status = $1 WHERE id = $2 RETURNING *`;
    const result = await db.query(queryText, [status, id]);

    res.status(200).json({
      success: true,
      message: `Participant status updated to ${status}`,
      payload: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getRoomParticipants = async (req, res) => {
  try {
    const { roomId } = req.params;
    const queryText = `
      SELECT p.*, u.name, u.image 
      FROM participants p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.room_id = $1 AND p.status = 'JOINED'
    `;
    const result = await db.query(queryText, [roomId]);

    res.status(200).json({
      success: true,
      payload: result.rows
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
