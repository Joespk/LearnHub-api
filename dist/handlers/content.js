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
Object.defineProperty(exports, "__esModule", { value: true });
const content_mapper_1 = __importDefault(require("../utils/content.mapper"));
const oembed_1 = __importDefault(require("../utils/oembed"));
const library_1 = require("@prisma/client/runtime/library");
class ContentHandler {
    constructor(repo) {
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const contents = yield this.repo.getAll();
            const contentListDto = contents.map(content_mapper_1.default);
            return res.status(200).json({ data: contentListDto }).end();
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { comment, rating, videoUrl } = req.body;
            if (rating < 0 || rating > 5)
                return res.status(400).json({
                    message: "rating is out of range",
                });
            try {
                const { authorName, authorUrl, thumbnailUrl, title } = yield (0, oembed_1.default)(videoUrl);
                const data = yield this.repo.create(res.locals.user.id, {
                    comment,
                    rating,
                    videoUrl,
                    creatorName: authorName,
                    creatorUrl: authorUrl,
                    thumbnailUrl: thumbnailUrl,
                    videoTitle: title,
                });
                return res.status(201).json((0, content_mapper_1.default)(data)).end();
            }
            catch (error) {
                console.error(error);
                if (error instanceof URIError)
                    return res.status(400).json({ message: error.message }).end();
                return res.status(500).json({ message: "Internal Server Error" }).end();
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const numericId = Number(id);
            if (isNaN(numericId))
                return res
                    .status(400)
                    .json({
                    message: "id is invalid",
                })
                    .end();
            const content = yield this.repo.getById(numericId);
            return res.status(200).json((0, content_mapper_1.default)(content)).end();
        });
        this.deleteById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const numericId = Number(id);
                const { Users: { id: ownerId }, } = yield this.repo.getById(numericId);
                if (ownerId !== res.locals.user.id)
                    throw new Error("Requested content is forbidden");
                const deletedContent = yield this.repo.deleteById(numericId);
                return res.status(200).json((0, content_mapper_1.default)(deletedContent)).end();
            }
            catch (error) {
                console.log(error);
                if (error instanceof library_1.PrismaClientKnownRequestError &&
                    error.code === "P2825")
                    return res.status(410).json({ message: "Content not found" }).end();
                if (error instanceof TypeError)
                    return res.status(400).json({ message: error.message }).end();
                if (error instanceof Error)
                    return res
                        .status(403)
                        .json({ message: `${error.message}` })
                        .end();
                return res.status(500).send({ message: "Internal Server Error" }).end();
            }
        });
        this.updateById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { comment, rating } = req.body;
            const numericId = Number(id);
            if (isNaN(numericId))
                return res.status(400).json({ message: "id is invalid" }).end();
            const { Users: { id: ownerId }, } = yield this.repo.getById(numericId);
            if (ownerId !== res.locals.user.id)
                return res
                    .status(403)
                    .json({ message: "Requested content is forbidden" })
                    .end();
            const content = yield this.repo.updateById(numericId, { comment, rating });
            return res.status(200).json((0, content_mapper_1.default)(content)).end();
        });
        this.repo = repo;
    }
}
exports.default = ContentHandler;
