// product.controller.ts
import { Request, Response } from "express";
import { Supplier } from "../entities/Supplier.entity";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Products.enitity";
import { validate } from "class-validator";

const productRepository = AppDataSource.getRepository(Product);
const supplierRepository = AppDataSource.getRepository(Supplier);

class ProductsController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { supplierId, ...data } = req.body;

      const supplier = await supplierRepository.findOne({ where: { id: supplierId } });
      if (!supplier) {
        res.status(404).json({ message: "Supplier not found" });
        return;
      }

      const product = productRepository.create({ ...data, supplier });
      const errors = await validate(product);
      if (errors.length > 0) {
        res.status(400).json({ success: false, errors });
        return;
      }

      const result = await productRepository.save(product);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async getOne(req: Request, res: Response): Promise<void> {
    try {
      const product = await productRepository.findOne({ where: { id: req.params.id }, relations: ["supplier"] });
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const product = await productRepository.findOne({ where: { id: req.params.id } });
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }

      const { supplierId, ...data } = req.body;
      if (supplierId) {
        const supplier = await supplierRepository.findOne({ where: { id: supplierId } });
        if (!supplier) {
          res.status(404).json({ success: false, message: "Supplier not found" });
          return;
        }
        product.supplier = supplier;
      }

      productRepository.merge(product, data);
      const errors = await validate(product);
      if (errors.length > 0) {
        res.status(400).json({ success: false, errors });
        return;
      }

      const result = await productRepository.save(product);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await productRepository.delete(req.params.id);
      if (result.affected === 0) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        minPrice,
        maxPrice,
        supplierId,
        sortBy = 'productName',
        sortOrder = 'ASC'
      } = req.query;

      // Validar parámetros de entrada
      const validatedPage = Math.max(1, Number(page));
      const validatedLimit = Math.max(1, Math.min(50, Number(limit)));

      const queryBuilder = productRepository.createQueryBuilder("product")
        .leftJoinAndSelect("product.supplier", "supplier");

      // Búsqueda por nombre del producto
      if (search) {
        const searchTerm = search.toString().trim();
        queryBuilder.andWhere(
          "LOWER(product.productName) LIKE LOWER(:search)",
          { search: `%${searchTerm}%` }
        );
      }

      // Filtro por rango de precios
      if (minPrice) {
        queryBuilder.andWhere("product.price >= :minPrice", {
          minPrice: Number(minPrice)
        });
      }

      if (maxPrice) {
        queryBuilder.andWhere("product.price <= :maxPrice", {
          maxPrice: Number(maxPrice)
        });
      }

      // Filtro por proveedor
      if (supplierId) {
        queryBuilder.andWhere("supplier.id = :supplierId", {
          supplierId: Number(supplierId)
        });
      }

      // Ordenamiento
      const allowedSortFields = ['productName', 'price', 'quantity'];
      const validSortField = allowedSortFields.includes(sortBy?.toString() || '')
        ? sortBy.toString()
        : 'productName';

      const validSortOrder = sortOrder?.toString().toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      queryBuilder.orderBy(`product.${validSortField}`, validSortOrder as 'ASC' | 'DESC');

      // Paginación
      queryBuilder
        .skip((validatedPage - 1) * validatedLimit)
        .take(validatedLimit);

      try {
        const [products, total] = await queryBuilder.getManyAndCount();

        res.status(200).json({
          success: true,
          data: products,
          total,
          pagination: {
            currentPage: validatedPage,
            limit: validatedLimit,
            totalPages: Math.ceil(total / validatedLimit)
          }
        });
      } catch (dbError) {
        console.error('Database query error:', dbError);
        throw dbError;
      }

    } catch (error) {
      console.error('GetAll products error:', error);
      res.status(500).json({
        success: false,
        error: "Error retrieving products. Please try again later.",
        ...(process.env.NODE_ENV === 'development' && { details: (error as Error).message })
      });
    }
  }

  // También necesitamos agregar un método para obtener los proveedores
  static async getSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const suppliers = await supplierRepository.find({
        select: ['id', 'name'], // Solo seleccionamos los campos necesarios
        order: { name: 'ASC' }  // Ordenamos por nombre
      });

      res.status(200).json({
        success: true,
        data: suppliers
      });
    } catch (error) {
      console.error('Get suppliers error:', error);
      res.status(500).json({
        success: false,
        error: "Error retrieving suppliers. Please try again later.",
        ...(process.env.NODE_ENV === 'development' && { details: (error as Error).message })
      });
    }
  }
}

export default ProductsController;
