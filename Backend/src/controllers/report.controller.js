const db = require('../config/database');

class ReportController {
  static async getTopUsers(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const query = `
        SELECT 
          u.id, 
          u.username, 
          COALESCE(SUM(t.total), 0) AS total_spent,
          RANK() OVER(ORDER BY COALESCE(SUM(t.total), 0) DESC) as rank
        FROM users u
        LEFT JOIN transactions t ON u.id = t.user_id AND t.status = 'paid'
        GROUP BY u.id, u.username
        ORDER BY rank
        LIMIT $1
      `;
      const result = await db.query(query, [limit]);

      res.status(200).json({
        success: true,
        message: 'Top users retrieved successfully',
        payload: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getItemsSold(req, res, next) {
    try {
      const query = `
        SELECT 
          i.id,
          i.name,
          COALESCE(SUM(t.quantity), 0) AS total_quantity_sold,
          COALESCE(SUM(t.total), 0) AS total_revenue
        FROM items i
        LEFT JOIN transactions t ON i.id = t.item_id AND t.status = 'paid'
        GROUP BY i.id, i.name
        ORDER BY total_revenue DESC
      `;
      const result = await db.query(query);

      res.status(200).json({
        success: true,
        message: 'Items sold report retrieved successfully',
        payload: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMonthlySales(req, res, next) {
    try {
      const year = req.query.year || new Date().getFullYear();
      const query = `
        SELECT 
          date_trunc('month', created_at) AS month,
          COUNT(id) AS total_transactions,
          COALESCE(SUM(total), 0) AS monthly_revenue
        FROM transactions
        WHERE status = 'paid' AND EXTRACT(YEAR FROM created_at) = $1
        GROUP BY date_trunc('month', created_at)
        ORDER BY month ASC
      `;
      const result = await db.query(query, [year]);

      res.status(200).json({
        success: true,
        message: 'Monthly sales report retrieved successfully',
        payload: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;
