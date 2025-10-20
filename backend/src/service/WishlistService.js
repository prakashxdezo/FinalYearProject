const Wishlist = require("../model/Wishlist");
const User = require("../model/User");

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate("products");
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
      await wishlist.save();
    }
    return wishlist;
  }

  async addToWishlist(userId, productId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      if (
        !wishlist.products.some((p) => p.toString() === productId.toString())
      ) {
        wishlist.products.push(productId);
      }
    }
    await wishlist.save();
    return wishlist.populate("products");
  }

  async removeFromWishlist(userId, productId) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) throw new Error("Wishlist not found");
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );
    await wishlist.save();
    return wishlist.populate("products");
  }

  async isInWishlist(userId, productId) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return false;
    return wishlist.products.some((p) => p.toString() === productId);
  }
}

module.exports = new WishlistService();
