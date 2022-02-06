"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const dao_1 = require("../dao");
let router = express_1.default.Router();
router.get('', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = (yield (0, dao_1.getAllRooms)()).rows;
        return res.json(rows);
    }
    catch (err) {
        console.error(err);
        next();
    }
}));
router.get('/map-data/:building', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = (yield (0, dao_1.getMapDataByBuilding)(req.params.building.toUpperCase()))
            .rows;
        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Building not found or no map data available',
            });
        }
        return res.json(rows);
    }
    catch (err) {
        console.error(err);
        next();
    }
}));
router.get('/lernphase', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = (yield (0, dao_1.getAllRoomsStudyTime)()).rows;
        return res.json(rows);
    }
    catch (err) {
        console.error(err);
        next();
    }
}));
router.get('/:room_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room_id = parseInt(req.params.room_id);
        const rows = (yield (0, dao_1.getRoomById)(room_id)).rows;
        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Room not found',
            });
        }
        return res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        next();
    }
}));
module.exports = router;
