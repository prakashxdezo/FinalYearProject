const Cart = require("../model/cart");
const CartItem = require("../model/CartItem");
const calculateDiscountPercentage = require("../util/CalculateDiscountPercentage.js");

class CartService {
  async findUserCart(user) {
    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = new Cart({ user: user._id, cartItems: [] });
      await cart.save();
    }

    // ✅ fetch real cart items from CartItem collection
    const cartItems = await CartItem.find({ cart: cart._id }).populate(
      "product",
    );

    let totalPrice = 0;
    let totalDiscountedPrice = 0;

    cartItems.forEach((item) => {
      totalPrice += item.mrpPrice || 0;
      totalDiscountedPrice += item.sellingPrice || 0;
    });

    // ✅ update cart totals in DB
    await Cart.findByIdAndUpdate(cart._id, {
      cartItems: cartItems.map((i) => i._id), // ✅ sync cartItems array
      totalMrpPrice: totalPrice,
      totalSellingPrice: totalDiscountedPrice,
      totalItem: cartItems.length,
      discount: calculateDiscountPercentage(totalPrice, totalDiscountedPrice),
    });

    cart.cartItems = cartItems; // for response
    cart.totalMrpPrice = totalPrice;
    cart.totalSellingPrice = totalDiscountedPrice;
    cart.totalItem = cartItems.length;

    return cart;
  }

  async addCartItem(user, product, size = "Standard", quantity = 1) {
    const cart = await this.findUserCart(user);

    const mrpPrice = product.mrpPrice || 0;
    const sellingPricePerUnit =
      product.sellingPrice ||
      product.mrpPrice - (product.mrpPrice * product.discountPercent) / 100;

    let isPresent = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
    });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        quantity,
        userId: user._id,
        sellingPrice: quantity * sellingPricePerUnit,
        mrpPrice: quantity * mrpPrice,
        size: size || "Standard",
        cart: cart._id,
      });

      const savedItem = await cartItem.save();

      // ✅ push item id into cart
      await Cart.findByIdAndUpdate(cart._id, {
        $addToSet: { cartItems: savedItem._id },
      });

      return savedItem;
    }

    return isPresent;
  }
}

module.exports = new CartService();
