const calculateDiscountPercentage = (mrpPrice, sellingPrice) => {
  if (mrpPrice <= 0) {
    return 0;
  }

  const discount = mrpPrice - sellingPrice;

  return Math.round((discount / mrpPrice) * 100);
};

module.exports = calculateDiscountPercentage;

