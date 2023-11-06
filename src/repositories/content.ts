import { PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreateContent } from ".";
import { DEFAULT_USER_SELECT } from "../const";
import { IUpdateContentDto } from "../dto/content";

export default class ContentRepository implements IContentRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAll(): Promise<IContent[]> {
    return this.prisma.content.findMany({
      include: {
        Users: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }

  create(ownerId: string, content: ICreateContent): Promise<IContent> {
    return this.prisma.content.create({
      data: {
        ...content,
        Users: {
          connect: { id: ownerId },
        },
      },
      include: {
        Users: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }

  getById(id: number): Promise<IContent> {
    return this.prisma.content.findUniqueOrThrow({
      where: { id },
      include: {
        Users: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }

  deleteById(id: number): Promise<IContent> {
    return this.prisma.content.delete({
      where: { id },
      include: {
        Users: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }

  updateById(id: number, data: IUpdateContentDto): Promise<IContent> {
    return this.prisma.content.update({
      data,
      where: { id },
      include: {
        Users: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }
}
