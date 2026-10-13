const jwt = require('jsonwebtoken');
const { sql } = require('../config/db');

/** Trích userId từ JWT / header / body / query (không xác thực DB). */
function extractUserId(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'star_learning_secret');
      if (decoded?.userId != null) return parseInt(decoded.userId, 10);
    } catch {
      // token invalid — caller xử lý
    }
  }
  if (req.headers['x-user-id']) {
    return parseInt(req.headers['x-user-id'], 10);
  }
  if (req.body && req.body.userId) {
    return parseInt(req.body.userId, 10);
  }
  if (req.query && req.query.userId) {
    return parseInt(req.query.userId, 10);
  }
  return null;
}

async function userHasAdminRole(userId) {
  if (!userId || Number.isNaN(userId)) return false;
  const result = await new sql.Request()
    .input('userId', sql.Int, userId)
    .query(`
      SELECT 1 FROM User_Roles ur
      JOIN Roles r ON ur.RoleId = r.RoleId
      WHERE ur.UserId = @userId AND r.RoleName = 'Admin'
    `);
  return result.recordset.length > 0;
}

/** Kiểm tra request có quyền Admin không (header x-role-name hoặc DB). Không throw. */
async function isAdminRequest(req) {
  const roleName = req.headers['x-role-name'];
  if (roleName && String(roleName).toLowerCase() === 'admin') {
    const userId = extractUserId(req);
    if (!userId || Number.isNaN(userId)) return false;
    // Header chỉ là gợi ý — vẫn xác thực role trong DB
    return userHasAdminRole(userId);
  }
  const userId = extractUserId(req);
  if (!userId || Number.isNaN(userId)) return false;
  try {
    return await userHasAdminRole(userId);
  } catch {
    return false;
  }
}

const protect = async (req, res, next) => {
  try {
    let userId;

    // 1. Check for JWT Token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'star_learning_secret');
      userId = decoded.userId;
    }
    // 2. Fallback check for session-based custom header or body/query payload
    else if (req.headers['x-user-id']) {
      userId = req.headers['x-user-id'];
    } else if (req.body && req.body.userId) {
      userId = req.body.userId;
    } else if (req.query && req.query.userId) {
      userId = req.query.userId;
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. No token or userId provided.' });
    }

    // Verify user exists in DB and is active
    const checkReq = new sql.Request();
    checkReq.input('userId', sql.Int, parseInt(userId, 10));
    const result = await checkReq.query('SELECT UserId, IsActive FROM Users WHERE UserId = @userId');

    if (result.recordset.length === 0) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User does not exist.' });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (result.recordset[0].IsActive === 0 || result.recordset[0].IsActive === false) {
      return res.status(401).json({ success: false, message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' });
    }

    // Attach user to request
    req.user = { userId: parseInt(userId, 10) };
    next();
  } catch (err) {
    console.error('[AuthMiddleware Error]', err.message);
    return res.status(401).json({ success: false, message: 'Unauthorized. Token is invalid or expired.' });
  }
};

/** Sau protect — chỉ Admin được tiếp tục. */
const adminOnly = async (req, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
  }

  try {
    const ok = await userHasAdminRole(userId);
    if (!ok) {
      return res.status(403).json({ success: false, message: 'Không có quyền Admin' });
    }
    req.user.isAdmin = true;
    return next();
  } catch (err) {
    console.error('[AdminOnly Error]', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { protect, adminOnly, isAdminRequest, extractUserId };
