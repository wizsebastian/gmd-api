import { Router } from "express";
import { OrdersController } from "../controller/OrdersController";

const router = Router();

// Rutas específicas primero
router.get("/client/:client_id", OrdersController.getOrdersByClient);
router.get("/status/:status", OrdersController.getOrdersByStatus);

// Rutas CRUD básicas
router.post("/", OrdersController.createOrder);
router.get("/", OrdersController.getOrders);

// Rutas con parámetro order_id
router.get("/:order_id", OrdersController.getOrder);
router.put("/:order_id", OrdersController.updateOrder);
router.patch("/:order_id/status", OrdersController.updateOrderStatus);
router.delete("/:order_id", OrdersController.deleteOrder);

export default router;