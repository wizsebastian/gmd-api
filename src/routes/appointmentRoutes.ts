import { Router } from "express";
import { EventDetailsController } from "../controller/EventDetailsController";

const router = Router();

router.post("/", EventDetailsController.create);

// recibe all the inputs need to only create the lead
router.post("/create", EventDetailsController.createFromWeb)

router.get("/", EventDetailsController.getAll);
router.get("/:id", EventDetailsController.getOne);
router.put("/:id", EventDetailsController.update);
router.delete("/:id", EventDetailsController.delete);

export default router;
