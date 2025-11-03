const ProductService = require("../service/ProductService.js");

class SellerProductController {
  async getProductBySeller(req, res) {
    try {
      if (!req.seller) {
        return res.status(401).json({ error: "Seller not authenticated" });
      }

      const products = await ProductService.getProductBySeller(req.seller._id);
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const seller = req.seller;
      const product = await ProductService.createProduct(req.body, seller);
      return res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      await ProductService.deleteProduct(req.params.productId);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await ProductService.updateProduct(
        req.params.productId,
        req.body,
      );

      return res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await ProductService.findProductById(
        req.params.productId,
      );
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async searchProduct(req, res) {
    try {
      const query = req.query.q;
      const products = await ProductService.searchProduct(query);
      return res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts(req.query);
      return res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new SellerProductController();
