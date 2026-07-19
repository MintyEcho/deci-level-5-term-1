const ActivityLog = require("../models/ActivityLog");

async function logActivity({ action, entity, entityId, userId, metadata }) {
  try {
    await ActivityLog.create({ action, entity, entityId, userId, metadata });
  } catch (err) {
    // Logging must never break the main request flow
    console.error("Failed to write activity log:", err.message);
  }
}

module.exports = { logActivity };
