"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var VendorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    logoUrl: { type: String },
    theme: {
        primaryColor: { type: String, default: '#7c3aed' },
        secondaryColor: { type: String, default: '#000000' }
    },
    contactEmail: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.models.Vendor || mongoose_1.default.model('Vendor', VendorSchema);
