"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyStatus = void 0;
var mongoose_1 = require("mongoose");
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["DRAFT"] = "DRAFT";
    PropertyStatus["SUBMITTED"] = "SUBMITTED";
    PropertyStatus["APPROVED"] = "APPROVED";
    PropertyStatus["REJECTED"] = "REJECTED";
    PropertyStatus["PUBLISHED"] = "PUBLISHED";
    PropertyStatus["PENDING"] = "PENDING";
    PropertyStatus["SOLD"] = "SOLD";
    PropertyStatus["ARCHIVED"] = "ARCHIVED";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
var PropertySchema = new mongoose_1.Schema({
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
    assignedAgentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    address: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, index: true },
    specs: {
        beds: { type: Number, required: true },
        baths: { type: Number, required: true },
        sqft: { type: Number, required: true },
        lotSize: { type: Number }
    },
    status: {
        type: String,
        enum: Object.values(PropertyStatus),
        default: PropertyStatus.DRAFT,
        index: true
    },
    images: [{ type: String }],
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    }
}, {
    timestamps: true
});
// Geospatial Index
PropertySchema.index({ location: '2dsphere' });
exports.default = mongoose_1.default.models.Property || mongoose_1.default.model('Property', PropertySchema);
