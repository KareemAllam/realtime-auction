import { Router, Request, Response } from "express";
import { Product } from "../models/Product";

const router: Router = Router();

// This will be populated by the main app
let product: Product | null = null;

// Set product reference
export const setProduct = (productInstance: Product): void => {
  product = productInstance;
};

// Get the single product
router.get("/", (req: Request, res: Response) => {
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

export { router as productsRouter };
