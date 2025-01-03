import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Service } from "../entities/Service";

const serviceRepository = AppDataSource.getRepository(Service);

export class ServiceController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const service = serviceRepository.create(req.body);
      const result = await serviceRepository.save(service);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const services = await serviceRepository.find();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getOne(req: Request, res: Response): Promise<void> {
    try {
      const service = await serviceRepository.findOneBy({ id: Number(req.params.id) });
      if (!service) {
        res.status(404).json({ message: "Service not found" });
        return;
      }
      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const service = await serviceRepository.findOneBy({ id: Number(req.params.id) });
      if (!service) {
        res.status(404).json({ message: "Service not found" });
        return;
      }

      serviceRepository.merge(service, req.body);
      const result = await serviceRepository.save(service);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await serviceRepository.delete(req.params.id);
      if (result.affected === 0) {
        res.status(404).json({ message: "Service not found" });
        return;
      }
      res.status(200).json({ message: "Service deleted" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}