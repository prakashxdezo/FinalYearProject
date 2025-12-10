import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useAppDispatch } from "../../../../Redux Toolkit/store";
import { deleteCartItem, updateCartItem } from "../../../../Redux Toolkit/features/customer/cartSlice";


const CartItemCard = ({item}) => {
  const dispatch = useAppDispatch();

  const handleUpdateCartItem=(quantity)=>{
    dispatch(updateCartItem(
      {
        jwt:localStorage.getItem("jwt"),
        cartItemId:item._id,
        quantity
      }
    ))
  }

  const handleRemove=()=>{
    dispatch(deleteCartItem(
      {
        jwt:localStorage.getItem("jwt"),
        cartItemId:item._id
      }
    ))
  }
  return (
    <div className="border border-gray-300 rounded-md relative">
      {/* Close Button */}
      <div className="absolute top-2 right-2">
        <IconButton size="small" color="primary">
          <CloseIcon />
        </IconButton>
      </div>

      <div className="p-5 flex gap-3">
        <div>
          <img
            className="w-22.5 rounded-md"
            src={item.product.images[0]}
            alt=""
          />
        </div>

        <div className="space-y-2">
          <h1 className="font-semibold text-lg">
            {item.product?.seller?.businessDetails?.businessName || "ToyVerse Seller"}
          </h1>

          <p className="text-gray-600 font-medium text-sm">
            {item.product.title}
          </p>

          <p className="text-gray-400 text-xs">
            <strong>Sold by:</strong>{" "}
            {item.product?.seller?.businessDetails?.businessName || "ToyVerse Marketplace"}
          </p>

          <p>
            <strong>30 Days replacement</strong> available
          </p>

          <p className="text-sm text-gray-500">
            <strong>Quantity</strong> : {item.quantity}
          </p>
        </div>
      </div>

      <Divider />

      <div className="px-5 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2 w-35 justify-between">
          <Button
            disabled={item.quantity === 1}
            onClick={() => handleUpdateCartItem(item.quantity - 1)}
            size="small"
          >
            <RemoveIcon />
          </Button>

          <span className="px-3 font-semibold">{item.quantity}</span>

          <Button
            onClick={() => handleUpdateCartItem(item.quantity + 1)}
            size="small"
          >
            <AddIcon />
          </Button>
        </div>

        <div>
          <p className="text-gray-700 font-semibold">Rs {item.sellingPrice} </p>
        </div>
      </div>
      <div className="absolute top-1 right-1">
        <IconButton onClick={handleRemove} color="primary">
          <CloseIcon/>
        </IconButton>
      </div>
    </div>
  );
};


export default CartItemCard;
