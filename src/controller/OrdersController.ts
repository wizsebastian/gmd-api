import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Client } from "../entities/Client";
import { Order } from "../entities/Orders.entity";
import { OrderItem } from "../entities/Order-item.entity";
import { OrderDetails } from "../entities/OrdersDetails";
import { Product } from "../entities/Products.enitity";
import { ItemPackage } from "../entities/ItemPackage";
import { Service } from "../entities/Service";

// Clase personalizada para errores de negocio
class BusinessError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'BusinessError';
  }
}

// Repositorios
const clientRepository = AppDataSource.getRepository(Client);
const orderRepository = AppDataSource.getRepository(Order);
const orderItemRepository = AppDataSource.getRepository(OrderItem);
const orderDetailsRepository = AppDataSource.getRepository(OrderDetails);
const productRepository = AppDataSource.getRepository(Product);
const packageRepository = AppDataSource.getRepository(ItemPackage);
const serviceRepository = AppDataSource.getRepository(Service);

// Función helper para manejar errores
const handleError = (error: unknown, res: Response) => {
  console.error('Error:', error);

  if (error instanceof BusinessError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  // Para errores de TypeORM u otros errores de base de datos
  if (error instanceof Error) {
    if (error.message.includes('foreign key constraint')) {
      return res.status(400).json({
        status: 'error',
        message: 'Referenced record does not exist'
      });
    }
    if (error.message.includes('duplicate')) {
      return res.status(400).json({
        status: 'error',
        message: 'Record already exists'
      });
    }
  }

  // Error genérico
  return res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred'
  });
};

export class OrdersController {
  static async createOrder(req: Request, res: Response) {
    try {
      const {
        client_id,
        order_items,
        recipientName,
        senderName,
        allergies,
        cardMessage,
        deliveryAddress,
        deliveryLocation,
        referenceContact
      } = req.body;

      // Validaciones
      if (!order_items?.length) {
        throw new BusinessError('Order items are required');
      }

      const client = await clientRepository.findOneBy({ id: client_id });
      if (!client) {
        throw new BusinessError('Client not found', 404);
      }

      // Crear orden
      const order = new Order();
      order.client = client;
      order.status = "pending";
      order.total = 0;

      const savedOrder = await orderRepository.save(order);

      // Procesar items
      let total = 0;
      for (const item of order_items) {
        const { item_type, item_id, quantity } = item;
        let unit_price = 0;

        // Obtener precio según tipo
        switch (item_type) {
          case "product": {
            const product = await productRepository.findOneBy({ id: item_id });
            if (!product) {
              throw new BusinessError(`Product with id ${item_id} not found`, 404);
            }
            unit_price = product.price;
            break;
          }
          case "package": {
            // Para packages, convertir el ID a número solo si es necesario
            const pkgId = item_type === "package" ? parseInt(item_id) : item_id;
            const pkg = await packageRepository.findOneBy({ id: pkgId });
            if (!pkg) {
              throw new BusinessError(`Package with id ${item_id} not found`, 404);
            }
            unit_price = pkg.price;
            break;
          }
          case "service": {
            // Para servicios, convertir el ID a número solo si es necesario
            const serviceId = item_type === "service" ? parseInt(item_id) : item_id;
            const service = await serviceRepository.findOneBy({ id: serviceId });
            if (!service) {
              throw new BusinessError(`Service with id ${item_id} not found`, 404);
            }
            unit_price = service.price;
            break;
          }
          default:
            throw new BusinessError(`Invalid item type: ${item_type}`);
        }

        const orderItem = orderItemRepository.create({
          order: savedOrder,
          item_type,
          item_id,
          quantity,
          unit_price,
          subtotal: quantity * unit_price
        });

        await orderItemRepository.save(orderItem);
        total += orderItem.subtotal ?? 0;
      }

      savedOrder.total = total;

      const orderDetails = orderDetailsRepository.create({
        recipientName,
        senderName,
        allergies,
        cardMessage,
        deliveryAddress,
        deliveryLocation,
        referenceContact,
        order: savedOrder
      });

      await orderDetailsRepository.save(orderDetails);
      await orderRepository.save(savedOrder);

      const completeOrder = await orderRepository.findOne({
        where: { order_id: savedOrder.order_id },
        relations: ["order_items", "client", "orderDetails"]
      });

      return res.status(201).json({
        status: 'success',
        data: completeOrder
      });

    } catch (error) {
      handleError(error, res);
    }
  }

  // Agregar estos métodos a la clase OrdersController

  static async updateOrder(req: Request, res: Response) {
    try {
      const { order_id } = req.params;
      const {
        status,
        order_items,
        recipientName,
        senderName,
        allergies,
        cardMessage,
        deliveryAddress,
        deliveryLocation,
        referenceContact
      } = req.body;

      // Buscar la orden existente
      const order = await orderRepository.findOne({
        where: { order_id: parseInt(order_id) },
        relations: ["order_items", "orderDetails"]
      });

      if (!order) {
        throw new BusinessError('Order not found', 404);
      }

      // Actualizar status si se proporciona
      if (status) {
        order.status = status;
      }

      // Actualizar items si se proporcionan
      if (order_items && order_items.length > 0) {
        // Eliminar items existentes
        await orderItemRepository.delete({ order: { order_id: parseInt(order_id) } });

        // Procesar nuevos items
        let total = 0;
        for (const item of order_items) {
          const { item_type, item_id, quantity } = item;
          let unit_price = 0;

          // Obtener precio según tipo
          switch (item_type) {
            case "product": {
              const product = await productRepository.findOneBy({ id: item_id });
              if (!product) {
                throw new BusinessError(`Product with id ${item_id} not found`, 404);
              }
              unit_price = product.price;
              break;
            }
            case "package": {
              // Para packages, convertir el ID a número solo si es necesario
              const pkgId = item_type === "package" ? parseInt(item_id) : item_id;
              const pkg = await packageRepository.findOneBy({ id: pkgId });
              if (!pkg) {
                throw new BusinessError(`Package with id ${item_id} not found`, 404);
              }
              unit_price = pkg.price;
              break;
            }
            case "service": {
              // Para servicios, convertir el ID a número solo si es necesario
              const serviceId = item_type === "service" ? parseInt(item_id) : item_id;
              const service = await serviceRepository.findOneBy({ id: serviceId });
              if (!service) {
                throw new BusinessError(`Service with id ${item_id} not found`, 404);
              }
              unit_price = service.price;
              break;
            }
            default:
              throw new BusinessError(`Invalid item type: ${item_type}`);
          }

          const orderItem = orderItemRepository.create({
            order,
            item_type,
            item_id,
            quantity,
            unit_price,
            subtotal: quantity * unit_price
          });

          await orderItemRepository.save(orderItem);
          total += orderItem.subtotal ?? 0;
        }

        order.total = total;
      }

      // Actualizar detalles de la orden si se proporcionan
      if (order.orderDetails) {
        if (recipientName) order.orderDetails.recipientName = recipientName;
        if (senderName) order.orderDetails.senderName = senderName;
        if (allergies) order.orderDetails.allergies = allergies;
        if (cardMessage) order.orderDetails.cardMessage = cardMessage;
        if (deliveryAddress) order.orderDetails.deliveryAddress = deliveryAddress;
        if (deliveryLocation) order.orderDetails.deliveryLocation = deliveryLocation;
        if (referenceContact) order.orderDetails.referenceContact = referenceContact;

        await orderDetailsRepository.save(order.orderDetails);
      }

      await orderRepository.save(order);

      // Obtener la orden actualizada con todas sus relaciones
      const updatedOrder = await orderRepository.findOne({
        where: { order_id: parseInt(order_id) },
        relations: ["order_items", "client", "orderDetails"]
      });

      return res.status(200).json({
        status: 'success',
        data: updatedOrder
      });

    } catch (error) {
      handleError(error, res);
    }
  }

  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { order_id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new BusinessError('Status is required');
      }

      const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new BusinessError('Invalid status value');
      }

      const order = await orderRepository.findOne({
        where: { order_id: parseInt(order_id) },
        relations: ["order_items", "client", "orderDetails"]
      });

      if (!order) {
        throw new BusinessError('Order not found', 404);
      }

      order.status = status;
      await orderRepository.save(order);

      return res.status(200).json({
        status: 'success',
        data: order
      });

    } catch (error) {
      handleError(error, res);
    }
  }

  static async getOrdersByClient(req: Request, res: Response) {
    try {
      const { client_id } = req.params;

      const client = await clientRepository.findOneBy({ id: client_id });
      if (!client) {
        throw new BusinessError('Client not found', 404);
      }

      const orders = await orderRepository.find({
        where: { client: { id: client_id } },
        relations: ["order_items", "orderDetails"],
        order: {
          created_at: "DESC"
        }
      });

      return res.status(200).json({
        status: 'success',
        data: orders
      });

    } catch (error) {
      handleError(error, res);
    }
  }

  static async getOrdersByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;

      const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new BusinessError('Invalid status value');
      }

      const orders = await orderRepository.find({
        where: { status },
        relations: ["order_items", "client", "orderDetails"],
        order: {
          created_at: "DESC"
        }
      });

      return res.status(200).json({
        status: 'success',
        data: orders
      });

    } catch (error) {
      handleError(error, res);
    }
  }

  // Agrega estos dos métodos al OrdersController

  static async getOrders(req: Request, res: Response) {
    try {
      const { client_id, status, created_at_start, created_at_end } = req.query;

      const queryBuilder = orderRepository.createQueryBuilder("order")
        .leftJoinAndSelect("order.order_items", "orderItem")
        .leftJoinAndSelect("order.client", "client")
        .leftJoinAndSelect("order.orderDetails", "orderDetails")
        .orderBy("order.created_at", "DESC");

      // Aplicar filtros si existen
      if (client_id) {
        queryBuilder.andWhere("client.id = :client_id", { client_id });
      }

      if (status) {
        const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status as string)) {
          throw new BusinessError('Invalid status value');
        }
        queryBuilder.andWhere("order.status = :status", { status });
      }

      if (created_at_start && created_at_end) {
        queryBuilder.andWhere("order.created_at BETWEEN :start AND :end", {
          start: created_at_start,
          end: created_at_end,
        });
      }

      const orders = await queryBuilder.getMany();

      return res.status(200).json({
        status: 'success',
        data: orders
      });

    } catch (error) {
      handleError(error, res);
    }
  }

  static async getOrder(req: Request, res: Response) {
    try {
      const { order_id } = req.params;

      if (!order_id || isNaN(parseInt(order_id))) {
        throw new BusinessError('Invalid order ID');
      }

      const order = await orderRepository.findOne({
        where: { order_id: parseInt(order_id) },
        relations: ["order_items", "client", "orderDetails"]
      });

      if (!order) {
        throw new BusinessError('Order not found', 404);
      }

      return res.status(200).json({
        status: 'success',
        data: order
      });

    } catch (error) {
      handleError(error, res);
    }
  }

  static async deleteOrder(req: Request, res: Response) {
    try {
      const { order_id } = req.params;

      const order = await orderRepository.findOne({
        where: { order_id: parseInt(order_id) },
        relations: ["order_items", "orderDetails"]
      });

      if (!order) {
        throw new BusinessError('Order not found', 404);
      }

      // Eliminar los items y detalles relacionados
      if (order.order_items) {
        await orderItemRepository.remove(order.order_items);
      }

      if (order.orderDetails) {
        await orderDetailsRepository.remove(order.orderDetails);
      }

      // Eliminar la orden
      await orderRepository.remove(order);

      return res.status(200).json({
        status: 'success',
        message: 'Order deleted successfully'
      });

    } catch (error) {
      handleError(error, res);
    }
  }
}