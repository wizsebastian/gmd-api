import { Router } from "express";
import { ItemPackageController } from "../controller/ItemPackageController";

const router = Router();

router.post("/", ItemPackageController.create);
router.get("/", ItemPackageController.getAll);
router.get("/:id", ItemPackageController.getOne);
router.put("/:id", ItemPackageController.update);
router.delete("/:id", ItemPackageController.delete);

export default router;
