import { Router } from "express";
import { CustomerController } from "./controller";

const router = Router();

router.get("/", CustomerController.getAllCustomers);
router.get("/:id", CustomerController.getCustomerById);
router.post("/", CustomerController.createCustomer);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

export default router;
