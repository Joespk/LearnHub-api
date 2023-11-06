"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../const");
class ContentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAll() {
        return this.prisma.content.findMany({
            include: {
                Users: {
                    select: const_1.DEFAULT_USER_SELECT,
                },
            },
        });
    }
    create(ownerId, content) {
        return this.prisma.content.create({
            data: Object.assign(Object.assign({}, content), { Users: {
                    connect: { id: ownerId },
                } }),
            include: {
                Users: {
                    select: const_1.DEFAULT_USER_SELECT,
                },
            },
        });
    }
    getById(id) {
        return this.prisma.content.findUniqueOrThrow({
            where: { id },
            include: {
                Users: {
                    select: const_1.DEFAULT_USER_SELECT,
                },
            },
        });
    }
    deleteById(id) {
        return this.prisma.content.delete({
            where: { id },
            include: {
                Users: {
                    select: const_1.DEFAULT_USER_SELECT,
                },
            },
        });
    }
}
exports.default = ContentRepository;
