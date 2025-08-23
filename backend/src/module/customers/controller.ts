import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class CustomerController {
  // Get all customers
  static async getAllCustomers(req: Request, res: Response) {
    try {
      const customers = await prisma.customer.findMany({
        include: {
          shipments: true,
        },
      });
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  }

  // Get customer by ID
  static async getCustomerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          shipments: true,
        },
      });

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  }

  // Create new customer
  static async createCustomer(req: Request, res: Response) {
    try {
      const { name, country, industry, demandForecast } = req.body;

      const customer = await prisma.customer.create({
        data: {
          name,
          country,
          industry,
          demandForecast,
        },
      });

      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ error: "Failed to create customer" });
    }
  }

  // Update customer
  static async updateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, country, industry, demandForecast } = req.body;

      const customer = await prisma.customer.update({
        where: { id },
        data: {
          name,
          country,
          industry,
          demandForecast,
        },
      });

      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Failed to update customer" });
    }
  }

  // Delete customer
  static async deleteCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.customer.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer" });
    }
  }
}
