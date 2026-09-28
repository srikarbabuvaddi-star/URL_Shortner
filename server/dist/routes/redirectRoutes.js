"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redirectEngine_1 = require("../redirect/redirectEngine");
const router = (0, express_1.Router)();
// Primary short code redirection route
router.get('/:shortCode', (req, res, next) => (0, redirectEngine_1.handleRedirect)(req, res, next));
exports.default = router;
