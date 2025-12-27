import {
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useAppSelector, useAppDispatch } from "../../Redux Toolkit/store";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  fetchSellerProduct,
} from "../../Redux Toolkit/features/seller/sellerProductSlice";
import { useState } from "react";

export default function ProductTable() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((store) => store.sellerProduct);
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: null,
    productName: "",
  });

  const handleDeleteClick = (productId, productName) => {
    setDeleteDialog({ open: true, productId, productName });
  };

  const handleDeleteConfirm = async () => {
    const jwt = localStorage.getItem("jwt");
    await dispatch(deleteProduct({ jwt, productId: deleteDialog.productId }));
    setDeleteDialog({ open: false, productId: null, productName: "" });
    dispatch(fetchSellerProduct(jwt));
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, productId: null, productName: "" });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">My Products</h2>
        <span className="text-sm text-gray-400">{products.length} listed</span>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <InventoryIcon style={{ color: "#d1d5db", fontSize: 56 }} />
          <p className="text-gray-400 mt-3 font-medium">
            No products yet. Add your first product!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Brand
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    MRP
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Selling Price
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Qty
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, i) => (
                  <tr
                    key={item._id}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0">
                          {item.images?.[0] && (
                            <img
                              src={item.images[0]}
                              alt=""
                              className="w-full h-full object-contain p-1"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 line-clamp-1 max-w-[180px]">
                            {item.title}
                          </p>
                          {item.ageGroup && (
                            <p className="text-xs text-gray-400">
                              {item.ageGroup}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {item.brand || "\u2014"}
                    </td>
                    <td className="px-5 py-3 text-sm">
                      {item.mrpPrice > item.sellingPrice ? (
                        <span className="text-gray-400 line-through">
                          NRs {item.mrpPrice?.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-bold text-gray-800">
                      NRs {item.sellingPrice?.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-sm font-medium">
                      {item.quantity}
                    </td>
                    <td className="px-5 py-3">
                      <Chip
                        label={item.quantity > 0 ? "In Stock" : "Out of Stock"}
                        color={item.quantity > 0 ? "success" : "error"}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/seller/product/edit/${item._id}`)
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <EditIcon style={{ fontSize: 13 }} /> Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(item._id, item.title)
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <DeleteIcon style={{ fontSize: 13 }} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        PaperProps={{ sx: { borderRadius: "12px", padding: "8px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Product</DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <strong>"{deleteDialog.productName}"</strong>? This action cannot be
            undone.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ borderRadius: "8px" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
