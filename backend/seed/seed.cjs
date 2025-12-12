"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Vendor_1 = require("../models/Vendor");
var User_1 = require("../models/User");
var Property_1 = require("../models/Property");
var AuditLog_1 = require("../models/AuditLog");
// Configuration
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lexonitservices_db_user:rK8FdwQHpTadfXlg@reallex.q5nxaar.mongodb.net/';
// Mock Hash (In real app, use bcrypt.hashSync('password', 10))
var MOCK_HASH = '$2a$10$X7V.7/8.9.10.11.12.13.14.15'; // "password"
var seed = function () { return __awaiter(void 0, void 0, void 0, function () {
    var superAdmin, vendor_1, vendorAdmin, manager, salesRep_1, propertiesData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('🌱 Starting Database Seed...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, 12, 14]);
                return [4 /*yield*/, mongoose_1.default.connect(MONGODB_URI)];
            case 2:
                _a.sent();
                console.log('✅ Connected to MongoDB');
                // 1. Clean Database
                return [4 /*yield*/, Promise.all([
                        Vendor_1.default.deleteMany({}),
                        User_1.default.deleteMany({}),
                        Property_1.default.deleteMany({}),
                        AuditLog_1.default.deleteMany({})
                    ])];
            case 3:
                // 1. Clean Database
                _a.sent();
                console.log('🧹 Database cleared');
                return [4 /*yield*/, User_1.default.create({
                        email: 'admin@ultrareal.com',
                        passwordHash: MOCK_HASH,
                        firstName: 'System',
                        lastName: 'Admin',
                        role: User_1.UserRole.SUPER_ADMIN,
                        isActive: true
                    })];
            case 4:
                superAdmin = _a.sent();
                console.log('👤 Super Admin created');
                return [4 /*yield*/, Vendor_1.default.create({
                        name: 'Prestige Estates',
                        slug: 'prestige',
                        logoUrl: 'https://via.placeholder.com/150',
                        theme: { primaryColor: '#7c3aed' }, // Matches standard purple theme
                        contactEmail: 'contact@prestige.com'
                    })];
            case 5:
                vendor_1 = _a.sent();
                console.log("\uD83C\uDFE2 Vendor \"".concat(vendor_1.name, "\" created"));
                return [4 /*yield*/, User_1.default.create({
                        email: 'admin@prestige.com',
                        passwordHash: MOCK_HASH,
                        firstName: 'Sarah',
                        lastName: 'Connor',
                        role: User_1.UserRole.VENDOR_ADMIN,
                        vendorId: vendor_1._id
                    })];
            case 6:
                vendorAdmin = _a.sent();
                return [4 /*yield*/, User_1.default.create({
                        email: 'manager@prestige.com',
                        passwordHash: MOCK_HASH,
                        firstName: 'John',
                        lastName: 'Doe',
                        role: User_1.UserRole.MANAGER,
                        vendorId: vendor_1._id
                    })];
            case 7:
                manager = _a.sent();
                return [4 /*yield*/, User_1.default.create({
                        email: 'agent@prestige.com',
                        passwordHash: MOCK_HASH,
                        firstName: 'Emily',
                        lastName: 'Rose',
                        role: User_1.UserRole.SALES_REP,
                        vendorId: vendor_1._id
                    })];
            case 8:
                salesRep_1 = _a.sent();
                console.log('👥 Vendor users created');
                propertiesData = [
                    {
                        address: '123 Beverly Park Dr, Beverly Hills, CA',
                        price: 12500000,
                        specs: { beds: 6, baths: 7, sqft: 8500 },
                        status: Property_1.PropertyStatus.PUBLISHED, // Was ACTIVE
                        location: { type: 'Point', coordinates: [-118.4004, 34.0736] }, // Beverly Hills
                        images: ['https://picsum.photos/800/600?random=1']
                    },
                    {
                        address: '456 Ocean Ave, Santa Monica, CA',
                        price: 4500000,
                        specs: { beds: 3, baths: 2, sqft: 2200 },
                        status: Property_1.PropertyStatus.PENDING,
                        location: { type: 'Point', coordinates: [-118.4912, 34.0195] }, // Santa Monica
                        images: ['https://picsum.photos/800/600?random=2']
                    },
                    {
                        address: '789 Downtown Loft, Los Angeles, CA',
                        price: 850000,
                        specs: { beds: 1, baths: 1.5, sqft: 1100 },
                        status: Property_1.PropertyStatus.PUBLISHED, // Was ACTIVE
                        location: { type: 'Point', coordinates: [-118.2437, 34.0522] }, // Downtown LA
                        images: ['https://picsum.photos/800/600?random=3']
                    },
                    {
                        address: '321 Silver Lake Blvd, Los Angeles, CA',
                        price: 1650000,
                        specs: { beds: 3, baths: 2, sqft: 1800 },
                        status: Property_1.PropertyStatus.SOLD,
                        location: { type: 'Point', coordinates: [-118.2694, 34.0867] }, // Silver Lake
                        images: ['https://picsum.photos/800/600?random=4']
                    },
                    {
                        address: '999 Hollywood Hills, Los Angeles, CA',
                        price: 3200000,
                        specs: { beds: 4, baths: 3, sqft: 3200 },
                        status: Property_1.PropertyStatus.PUBLISHED, // Was ACTIVE
                        location: { type: 'Point', coordinates: [-118.3287, 34.1177] }, // Hollywood Hills
                        images: ['https://picsum.photos/800/600?random=5']
                    }
                ];
                return [4 /*yield*/, Property_1.default.insertMany(propertiesData.map(function (p) { return (__assign(__assign({}, p), { vendorId: vendor_1._id, assignedAgentId: salesRep_1._id })); }))];
            case 9:
                _a.sent();
                console.log("\uD83C\uDFE0 ".concat(propertiesData.length, " Properties created"));
                // 6. Create Audit Log Entry
                return [4 /*yield*/, AuditLog_1.default.create({
                        userId: vendorAdmin._id,
                        action: 'SYSTEM_INIT',
                        targetModel: 'Vendor',
                        targetId: vendor_1._id,
                        details: { message: 'Initial seed completed' }
                    })];
            case 10:
                // 6. Create Audit Log Entry
                _a.sent();
                console.log('📝 Audit log created');
                console.log('✨ Seed completed successfully!');
                return [3 /*break*/, 14];
            case 11:
                error_1 = _a.sent();
                console.error('❌ Seed failed:', error_1);
                process.exit(1);
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, mongoose_1.default.disconnect()];
            case 13:
                _a.sent();
                console.log('👋 Disconnected');
                return [7 /*endfinally*/];
            case 14: return [2 /*return*/];
        }
    });
}); };
seed();
