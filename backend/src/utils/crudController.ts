import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../config/prisma";

function crudController(model: keyof PrismaClient) {
  const client = prisma[model] as any;

  return {
    async create(req: Request, res: Response) {
      const item = await client.create({ data: req.body });
      res.json(item);
    },
    async list(req: Request, res: Response) {
      const items = await client.findMany();
      res.json(items);
    },
    async retrieve(req: Request, res: Response) {
      const { id } = req.params;
      const item = await client.findUnique({ where: { id: Number(id) } });
      res.json(item);
    },
    async update(req: Request, res: Response) {
      const { id } = req.params;
      const item = await client.update({
        where: { id: Number(id) },
        data: req.body,
      });
      res.json(item);
    },
    async delete(req: Request, res: Response) {
      const { id } = req.params;
      await client.delete({ where: { id: Number(id) } });
      res.json({ message: "Deleted" });
    },
  };
}

export default crudController;
