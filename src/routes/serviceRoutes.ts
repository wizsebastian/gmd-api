import { Router } from "express";
import { ServiceController } from "../controller/ServiceController";

const router = Router();

// Rutas CRUD básicas para servicios
router.post("/", ServiceController.create);
router.get("/", ServiceController.getAll);
router.get("/:id", ServiceController.getOne);
router.put("/:id", ServiceController.update);
router.delete("/:id", ServiceController.delete);

export default router;