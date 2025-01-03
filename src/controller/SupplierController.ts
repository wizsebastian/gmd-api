import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Supplier } from "../entities/Supplier.entity";
import { AppDataSource } from "../data-source";

const supplierRepository = AppDataSource.getRepository(Supplier);

export class SupplierController {
  static async getAllSuppliers(req: Request, res: Response) {
    try {
      const suppliers = await supplierRepository.find();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching suppliers", error });
    }
  }

  static async getSupplierById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const supplier = await supplierRepository.findOne({ where: { id } });
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Error fetching supplier", error });
    }
  }

  static async createSupplier(req: Request, res: Response) {
    try {

      const supplier = supplierRepository.create(req.body);
      const savedSupplier = await supplierRepository.save(supplier);
      res.status(201).json(savedSupplier);
    } catch (error) {
      res.status(500).json({ message: "Error creating supplier", error });
    }
  }

  static async updateSupplier(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const supplier = await supplierRepository.findOne({ where: { id } });

      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      supplierRepository.merge(supplier, req.body);
      const updatedSupplier = await supplierRepository.save(supplier);
      res.json(updatedSupplier);
    } catch (error) {
      res.status(500).json({ message: "Error updating supplier", error });
    }
  }

  static async deleteSupplier(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const supplier = await supplierRepository.findOne({ where: { id } });

      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      await supplierRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting supplier", error });
    }
  }
}
