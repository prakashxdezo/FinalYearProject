const CartItem = require("../model/CartItem");

class CartItemService{
    async updateCartItem(userId, cartItemId, cartItemData){
        const cartItem=await this.findCartItemById(cartItemId);

        if (cartItem.userId.toString() !== userId.toString()) {
          throw new Error("Unauthorized access");
        }

        if (!cartItem.product) {
          throw new Error("Product not found for this cart item");
        }

        const sellingPricePerUnit =
          cartItem.product.sellingPrice ||
          cartItem.product.mrpPrice -
            (cartItem.product.mrpPrice * cartItem.product.discountPercent) /
              100;

            const updated = {
              quantity: cartItemData.quantity,
              mrpPrice:
                cartItemData.quantity * (cartItem.product.mrpPrice || 0),
              sellingPrice: cartItemData.quantity * sellingPricePerUnit,
            };

            return await CartItem.findByIdAndUpdate(cartItemId, updated,{
                new : true
            }).populate("product");
     
    }   

    async removeCartItem(userId, cartItemId){
        const cartItem=await this.findCartItemById(cartItemId);

        if(cartItem.userId.toString()===userId.toString()){
            await CartItem.deleteOne({_id:cartItem._id})
        }else{
            throw new Error("Unauthorized access");
        }
    }
    async findCartItemById(cartItemId){
        const cartItem = await CartItem.findById(cartItemId).populate
        ("product");

        if(!cartItem.product){
            throw new Error("product not found for this cart");

        }

        return cartItem;
    }
}

module.exports = new CartItemService();