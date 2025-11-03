const WishlistService = require("../service/WishlistService");
const User = require("../model/User");
const jwtProvider = require("../util/jwtProvider");

class WishlistController {
  async getWishlist(req, res) {
    try {
      const user = req.user;
      const wishlist = await WishlistService.getWishlist(user._id);
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addToWishlist(req, res) {
    try {
      const user = req.user;
      const { productId } = req.body;
      if (!productId) return res.status(400).json({ message: "productId is required" });
      const wishlist = await WishlistService.addToWishlist(user._id, productId);
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeFromWishlist(req, res) {
    try {
      const user = req.user;
      const { productId } = req.params;
      const wishlist = await WishlistService.removeFromWishlist(user._id, productId);
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new WishlistController();
