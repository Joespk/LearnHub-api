import { Content } from "@prisma/client";
import { IUserDto } from "./user";

export interface ICreateContentDto {
  videoUrl: string;
  comment: string;
  rating: number;
}

export interface IContentDto
  extends Omit<Content, "ownerId" | "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
  postedBy: IUserDto;
}

export interface IContentsDto {
  data: IContentDto[];
}
