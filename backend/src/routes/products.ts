import { Router, Request, Response } from "express";
import { Product } from "../models/Product";

const router: Router = Router();

let product: Product | null = null;

export const setProduct = (productInstance: Product): void => {
  product = productInstance;
};

router.get("/", (_: Request, res: Response) => {
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

export { router as productsRouter };
