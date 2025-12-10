import React, { useEffect, useState } from 'react';
import StarIcon from "@mui/icons-material/Star";
import Divider from '@mui/material/Divider';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WalletIcon from "@mui/icons-material/Wallet";
import Button from '@mui/material/Button';
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import SecurityIcon from "@mui/icons-material/Security";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import SimilarProduct from './SimilarProduct';
import store, { useAppDispatch, useAppSelector } from '../../../../../Redux Toolkit/store';
import { fetchProductById } from '../../../../../Redux Toolkit/features/customer/productSlice';
import { useParams } from 'react-router';
import { addItemToCart } from '../../../../../Redux Toolkit/features/customer/cartSlice';
import Chip from '@mui/material/Chip';

const ProductDetails = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const product = useAppSelector(store => store.product);
  const { productId, categoryId } = useParams();

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch]);

  const handleChangeCurrentImage = (index) => setCurrentImage(index);
  const handleQuantityChange = (value) => {
    const newQty = quantity + value;
    if (newQty >= 1) setQuantity(newQty);
  };

  const handleAddCartItem = () => {
    const request = {
      productId: product.product?._id,
      quantity: quantity,
    };
    dispatch(addItemToCart({ jwt: localStorage.getItem("jwt"), request }));
  };

  const p = product.product;

  return (
    <div className="min-h-screen px-5 lg:px-20 pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image gallery */}
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[15%] flex flex-col gap-3">
            {p?.images.map((item, index) => (
              <img
                key={index}
                onClick={() => handleChangeCurrentImage(index)}
                className={`lg:w-full w-12 cursor-pointer rounded-md border-2 ${
                  currentImage === index
                    ? "border-orange-500"
                    : "border-transparent"
                }`}
                src={item}
                alt=""
              />
            ))}
          </div>

          <div className="w-full lg:w-[85%]">
            <img
              src={p?.images[currentImage]}
              className="w-full rounded-md shadow-lg"
              alt={p?.title}
            />
          </div>
        </section>

        {/* Product info */}
        <section>
          <h1 className="font-bold text-lg text-orange-600">
            {p?.seller?.businessDetails?.businessName || "ToyVerse Seller"}
          </h1>
          <p className="text-gray-500 font-semibold text-xl mt-1">{p?.title}</p>

          {p?.brand && (
            <p className="text-sm text-gray-400 mt-1">
              Brand:{" "}
              <span className="font-medium text-gray-600">{p.brand}</span>
            </p>
          )}

          <div className="flex justify-between items-center py-2 border border-gray-200 w-45 px-3 mt-5">
            <div className="flex gap-1 items-center">
              <span>4</span>
              <StarIcon sx={{ color: "#e85d04" }} />
            </div>
            <Divider orientation="vertical" flexItem />
            <span>478 Ratings</span>
          </div>

          <div className="space-y-2 pt-5">
            <div className="flex gap-3 items-center price">
              <span className="text-orange-600 font-bold text-xl">
                NRs {p?.sellingPrice?.toLocaleString()}
              </span>
              {p?.mrpPrice > p?.sellingPrice && (
                <span className="line-through text-gray-400">
                  NRs {p?.mrpPrice?.toLocaleString()}
                </span>
              )}
              {p?.discountPercent > 0 && (
                <span className="text-green-500 font-semibold">
                  {p?.discountPercent}% off
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Inclusive of all taxes. Free Shipping above NRs 1500.
            </p>
          </div>

          {/* Toy attributes */}
          <div className="mt-5 flex flex-wrap gap-2">
            {p?.ageGroup && (
              <Chip
                icon={<ChildCareIcon />}
                label={`Ages: ${p.ageGroup}`}
                variant="outlined"
                color="warning"
                size="small"
              />
            )}
            {p?.safetyCertification && (
              <Chip
                icon={<SecurityIcon />}
                label={p.safetyCertification}
                variant="outlined"
                color="success"
                size="small"
              />
            )}
            {p?.batteryRequired && (
              <Chip
                icon={<BatteryChargingFullIcon />}
                label="Battery Required"
                variant="outlined"
                color="info"
                size="small"
              />
            )}
            {p?.material && (
              <Chip
                label={`Material: ${p.material}`}
                variant="outlined"
                size="small"
              />
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-4">
              <VerifiedUserIcon color="warning" />
              <p>Authentic & Safety Certified Toys</p>
            </div>
            <div className="flex items-center gap-4">
              <WorkspacePremiumIcon color="warning" />
              <p>100% Money Back Guarantee</p>
            </div>
            <div className="flex items-center gap-4">
              <LocalShippingIcon color="warning" />
              <p>Free Shipping & Returns</p>
            </div>
            <div className="flex items-center gap-4">
              <WalletIcon color="warning" />
              <p>Pay on Delivery Available</p>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-7 space-y-2">
            <h1 className="font-semibold text-gray-700">QUANTITY</h1>
            <div className="flex items-center gap-2 w-35 justify-between">
              <Button
                onClick={() => handleQuantityChange(-1)}
                variant="outlined"
                color="warning"
              >
                <RemoveIcon />
              </Button>
              <span className="font-bold text-lg">{quantity}</span>
              <Button
                onClick={() => handleQuantityChange(1)}
                variant="outlined"
                color="warning"
              >
                <AddIcon />
              </Button>
            </div>
          </div>

          <div className="mt-5">
            {p?.quantity > 0 ? (
              <Chip
                label={`In Stock (${p.quantity} available)`}
                color="success"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip
                label="Out of Stock"
                color="error"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </div>

          {/* Actions */}
          <div className="mt-12 flex items-center gap-5">
            <Button
              startIcon={<AddShoppingCartIcon />}
              variant="contained"
              fullWidth
              sx={{
                py: "1rem",
                backgroundColor: p?.quantity > 0 ? "#e85d04" : "#9ca3af",
                "&:hover": {
                  backgroundColor: p?.quantity > 0 ? "#c44c03" : "#9ca3af",
                },
              }}
              onClick={handleAddCartItem}
              disabled={!p?.quantity || p?.quantity <= 0}
            >
              {p?.quantity > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>

            <Button
              startIcon={<FavoriteBorderIcon />}
              variant="outlined"
              fullWidth
              color="warning"
              sx={{ py: "1rem" }}
            >
              Wishlist
            </Button>
          </div>

          <div className="mt-5">
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{p?.description}</p>
          </div>
        </section>
      </div>

      <section className="mt-20">
        <h1 className="text-lg font-bold">🧸 Similar Toys</h1>
        <div className="pt-5">

          <SimilarProduct
            currentProductId={p?._id}
            categoryId={p?.category3 || p?.category}
          />
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
