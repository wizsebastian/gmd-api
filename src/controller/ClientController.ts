import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Client } from "../entities/Client";
import { AppDataSource } from "../data-source";

const clientRepository = AppDataSource.getRepository(Client);

export class ClientController {
  static async getAllClients(req: Request, res: Response) {
    try {
      const clients = await clientRepository.find();
      res.json(clients);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Error fetching clients", error });
    }
  }

  static async createClient(req: Request, res: Response) {
    try {
      const { createdBy, ...data } = req.body;
      const clientPayload = clientRepository.create({ ...data, createdBy });
      const result = await clientRepository.save(clientPayload);
      res.status(201).json(result);
    } catch (error) {
      console.log("eerrror", error)
      res.status(500).json({ message: "Error creating client", error });
    }
  }

  static async getOne(req: Request, res: Response): Promise<void> {
    try {
      const product = await clientRepository.findOneBy({ id: req.params.id });
      if (!product) {
        res.status(404).json({ message: "Client not found" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }


  static async update(req: Request, res: Response): Promise<void> {
    try {
      const product = await clientRepository.findOneBy({ id: req.params.id });
      if (!product) {
        res.status(404).json({ message: "Client not found" });
        return;
      }

      clientRepository.merge(product, req.body);
      const result = await clientRepository.save(product);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await clientRepository.delete(req.params.id);
      if (result.affected === 0) {
        res.status(404).json({ message: "Client not found" });
        return;
      }
      res.status(200).json({ message: "Client deleted" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
