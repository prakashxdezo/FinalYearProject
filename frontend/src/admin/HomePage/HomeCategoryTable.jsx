import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteHomeCategory } from "../../Redux Toolkit/features/customer/HomeCategorySlice";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useAppDispatch } from "../../Redux Toolkit/store";
import { updateHomeCategory } from "../../Redux Toolkit/features/customer/HomeCategorySlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

export default function HomeCategoryTable({ categories = [] }) {
  const dispatch = useAppDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    categoryId: "",
  });

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      image: item.image,
      categoryId: item.categoryId,
    });
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    dispatch(updateHomeCategory({ id: selectedItem._id, data: formData }));
    handleClose();
  };

  const handleDelete = (id) => {
    dispatch(deleteHomeCategory(id));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>No</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="right">Category ID</StyledTableCell>
              <StyledTableCell align="right">Edit</StyledTableCell>
              <StyledTableCell align="right">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((item, index) => (
              <StyledTableRow key={item._id}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>
                  <img
                    className="w-20 h-14 object-cover rounded-md"
                    src={item.image}
                    alt={item.name}
                  />
                </StyledTableCell>
                <StyledTableCell>{item.name}</StyledTableCell>
                <StyledTableCell align="right">
                  {item.categoryId}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton onClick={() => handleEditClick(item)}>
                    <EditIcon color="primary" />
                  </IconButton>
                </StyledTableCell>

                <StyledTableCell align="right">
                  <IconButton onClick={() => handleDelete(item._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <div className="space-y-4 pt-2">
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Category ID"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
            {/* Image Preview */}
            {formData.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                <img
                  src={formData.image}
                  alt="preview"
                  className="w-32 h-24 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
