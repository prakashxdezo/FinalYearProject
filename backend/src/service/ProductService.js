const Category = require("../model/Category.js");
const Product = require("../model/Product.js");
const calculateDiscountPercentage = require("../util/CalculateDiscountPercentage.js");

class ProductService {
  async createProduct(req, seller) {
    try {
      const discountPercent = calculateDiscountPercentage(
        req.mrpPrice,
        req.sellingPrice,
      );

      const sellingPrice =
        req.sellingPrice ||
        req.mrpPrice - (req.mrpPrice * discountPercent) / 100;

      const category1 = await this.createOrGetCategory(req.category, 1);
      const category2 = await this.createOrGetCategory(
        req.category2,
        2,
        category1._id,
      );
      const category3 = await this.createOrGetCategory(
        req.category3,
        3,
        category2._id,
      );

      const product = new Product({
        title: req.title,
        description: req.description,
        images: req.images,
        sellingPrice,
        mrpPrice: req.mrpPrice,
        discountPercent,
        color: req.color || "Multicolor",
        quantity: req.quantity,
        seller: seller._id,
        category: category3._id,
        numRatings: req.numRatings || 0,
        ageGroup: req.ageGroup || "All Ages",
        material: req.material || "Plastic",
        safetyCertification: req.safetyCertification || "CE Certified",
        batteryRequired: req.batteryRequired || false,
        brand: req.brand || "Generic",
      });

      return await product.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createOrGetCategory(categoryId, level, parentId = null) {
    let category = await Category.findOne({ categoryId });
    if (!category) {
      category = new Category({
        categoryId,
        level,
        parentCategory: parentId,
      });
      category = await category.save();
    }
    return category;
  }

  async deleteProduct(productId) {
    try {
      await Product.findByIdAndDelete(productId);
      return "Product deleted..";
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(productId, updateProductData) {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        updateProductData,
        { new: true },
      );
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findProductById(productId) {
    try {
      const product = await Product.findById(productId).populate(
        "seller",
        "businessDetails email",
      );
      if (!product) throw new Error("Product not found");
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async searchProduct(query) {
    try {
      const regex = new RegExp(query, "i");
      const products = await Product.find({
        $or: [{ title: regex }, { description: regex }, { brand: regex }],
      }).populate("seller", "businessDetails email");
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductBySeller(sellerId) {
    return await Product.find({ seller: sellerId });
  }

  async getAllProducts(req) {
    const filterQuery = {};

    if (req.category && req.category !== "all") {
      // ✅ detect if it's a MongoDB ObjectId or a categoryId string
      const isObjectId = req.category.match(/^[0-9a-fA-F]{24}$/);

      const category = isObjectId
        ? await Category.findById(req.category)
        : await Category.findOne({ categoryId: req.category });

      if (!category) {
        return { content: [], totalpages: 0, totalElement: 0 };
      }

      if (category.level === 3) {
        filterQuery.category = category._id;
      } else if (category.level === 2) {
        const children = await Category.find({ parentCategory: category._id });
        filterQuery.category = { $in: children.map((c) => c._id) };
      } else {
        const level2 = await Category.find({ parentCategory: category._id });
        const level2Ids = level2.map((c) => c._id);
        const level3 = await Category.find({
          parentCategory: { $in: level2Ids },
        });
        filterQuery.category = { $in: level3.map((c) => c._id) };
      }
    }

    if (req.color) {
      filterQuery.color = req.color;
    }

    if (req.ageGroup && req.ageGroup !== "All Ages") {
      filterQuery.ageGroup = req.ageGroup;
    }

    if (req.minPrice && req.maxPrice) {
      filterQuery.sellingPrice = {
        $gte: Number(req.minPrice),
        $lte: Number(req.maxPrice),
      };
    }

    if (req.minDiscount) {
      filterQuery.discountPercent = { $gte: req.minDiscount };
    }

    let sortQuery = {};
    if (req.sort === "price_low") {
      sortQuery.sellingPrice = 1;
    } else if (req.sort === "price_high") {
      sortQuery.sellingPrice = -1;
    }

    const pageNumber = Number(req.pageNumber) || 0;
    const pageSize = Number(req.pageSize) || 10;

    const products = await Product.find(filterQuery)
      .populate("seller", "businessDetails businessName email")
      .sort(sortQuery)
      .skip(pageNumber * pageSize)
      .limit(pageSize);

    const totalElement = await Product.countDocuments(filterQuery);
    const totalpages = Math.ceil(totalElement / pageSize);

    return {
      content: products,
      totalpages,
      totalElement,
    };
  }
}

module.exports = new ProductService();
