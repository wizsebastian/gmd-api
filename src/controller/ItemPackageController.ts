import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ItemPackage } from "../entities/ItemPackage";

const itemPackageRepository = AppDataSource.getRepository(ItemPackage);

export class ItemPackageController {
  // Create Item Package
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { createdBy, products, ...data } = req.body;

      // Validate products
      if (!Array.isArray(products)) {
        res.status(400).json({ message: "Products must be an array" });
        return;
      }

      const itemPackage = itemPackageRepository.create({
        ...data,
        createdBy,
        products,
      });

      const result = await itemPackageRepository.save(itemPackage);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Get All Item Packages
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const itemPackages = await itemPackageRepository.find();
      console.log("HERE!@#!@#!@#!@#", itemPackages);
      // Ensure products is valid JSON
      const sanitizedPackages = itemPackages.map((pkg: any) => ({
        ...pkg,
        products: pkg.products || [] // Default to empty array if null
      }));

      res.status(200).json(sanitizedPackages);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Get One Item Package
  static async getOne(req: Request, res: Response): Promise<void> {
    try {
      const itemPackage = await itemPackageRepository.findOneBy({ id: Number(req.params.id) });

      if (!itemPackage) {
        res.status(404).json({ message: "Item package not found" });
        return;
      }

      // Ensure products is valid JSON
      itemPackage.products = itemPackage.products || [];

      res.status(200).json(itemPackage);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Update Item Package
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const itemPackage = await itemPackageRepository.findOneBy({ id: Number(req.params.id) });

      if (!itemPackage) {
        res.status(404).json({ message: "Item package not found" });
        return;
      }

      const { products, ...data } = req.body;

      // Validate products
      if (products && !Array.isArray(products)) {
        res.status(400).json({ message: "Products must be an array" });
        return;
      }

      itemPackageRepository.merge(itemPackage, { ...data, products });
      const result = await itemPackageRepository.save(itemPackage);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Delete Item Package
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const itemPackage = await itemPackageRepository.findOneBy({ id: Number(req.params.id) });

      if (!itemPackage) {
        res.status(404).json({ message: "Item package not found" });
        return;
      }

      await itemPackageRepository.remove(itemPackage);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
