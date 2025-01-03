import { Router } from "express";
import { ClientController } from "../controller/ClientController";

const router = Router();

router.get("/", ClientController.getAllClients);
router.get("/:id", ClientController.getOne);
router.post("/", ClientController.createClient);
router.put("/:id", ClientController.update);
router.delete("/:id", ClientController.delete);

export default router;