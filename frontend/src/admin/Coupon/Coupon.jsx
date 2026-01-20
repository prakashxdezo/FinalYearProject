import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { Chip, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { useEffect } from "react";
import {
  deleteCoupon,
  fetchAllCoupon,
} from "../../Redux Toolkit/features/Admin/CouponSlice";

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

export default function Coupon() {
  const dispatch = useAppDispatch();
  const { coupons = [] } = useAppSelector((store) => store.adminCoupon);

  useEffect(() => {
    dispatch(fetchAllCoupon(localStorage.getItem("jwt")));
  }, []);

  const handleDelete = (id) => {
    dispatch(deleteCoupon({ id, jwt: localStorage.getItem("jwt") }));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Coupon Code</StyledTableCell>
            <StyledTableCell align="right">Discount %</StyledTableCell>
            <StyledTableCell align="right">Min Order Value</StyledTableCell>
            <StyledTableCell align="right">Expiry Date</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons.map((row) => (
            <StyledTableRow key={row._id}>
              <StyledTableCell component="th" scope="row">
                <strong>{row.code}</strong>
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.discountPercentage}%
              </StyledTableCell>
              <StyledTableCell align="right">
                Rs {row.minimumOrderValue.toLocaleString()}
              </StyledTableCell>
              <StyledTableCell align="right">
                {formatDate(row.expiryDate)}
              </StyledTableCell>
              <StyledTableCell align="right">
                <Chip
                  label={row.isActive ? "Active" : "Inactive"}
                  color={row.isActive ? "success" : "error"}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align="right">
                <IconButton onClick={() => handleDelete(row._id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
