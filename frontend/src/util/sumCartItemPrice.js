export const sumCartItemMrpPrice = (cartItems = []) => {
  return cartItems.reduce(
    (total, item) =>
      total + (item.product?.mrpPrice || 0) * (item.quantity || 1),
    0,
  );
};

export const sumCartItemSellingPrice = (cartItems = []) => {
  return cartItems.reduce(
    (total, item) => total + (item.sellingPrice || 0) * (item.quantity || 1),
    0,
  );
};
