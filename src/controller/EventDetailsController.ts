import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { EventDetails } from "../entities/EventDetails";

const eventDetailsRepository = AppDataSource.getRepository(EventDetails);

export class EventDetailsController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const eventDetails = eventDetailsRepository.create(req.body);
      const result = await eventDetailsRepository.save(eventDetails);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
  static async createFromWeb(req: Request, res: Response): Promise<void> {
    try {
      const eventDetails = eventDetailsRepository.create(req.body);
      const result = await eventDetailsRepository.save(eventDetails);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const events = await eventDetailsRepository.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getOne(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventDetailsRepository.findOneBy({ id: Number(req.params.id) });
      if (!event) {
        res.status(404).json({ message: "Event not found" });
        return;
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventDetailsRepository.findOneBy({ id: Number(req.params.id) });
      if (!event) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      eventDetailsRepository.merge(event, req.body);
      const result = await eventDetailsRepository.save(event);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await eventDetailsRepository.delete(req.params.id);
      if (result.affected === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
      }
      res.status(200).json({ message: "Event deleted" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
