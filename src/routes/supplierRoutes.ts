import { Router } from "express";
import { SupplierController } from "../controller/SupplierController";

const router = Router();

router.get("/", SupplierController.getAllSuppliers);
router.get("/:id", SupplierController.getSupplierById);
router.post("/", SupplierController.createSupplier);
router.put("/:id", SupplierController.updateSupplier);
router.delete("/:id", SupplierController.deleteSupplier);

export default router;