"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var AuditLogSchema = new mongoose_1.Schema({
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vendor', index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true }, // e.g., 'CREATE_LEAD', 'UPDATE_PROPERTY'
    targetModel: { type: String }, // e.g., 'Property', 'Lead'
    targetId: { type: mongoose_1.Schema.Types.ObjectId },
    details: { type: mongoose_1.Schema.Types.Mixed }, // Flexible JSON payload
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now, index: true }
});
// Expire logs after 1 year to save space (optional)
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });
exports.default = mongoose_1.default.models.AuditLog || mongoose_1.default.model('AuditLog', AuditLogSchema);
