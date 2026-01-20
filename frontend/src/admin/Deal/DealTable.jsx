import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import store, { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { useEffect } from "react";
import {
  deleteDeal,
  getAllDeals,
} from "../../Redux Toolkit/features/Admin/DealSlice";

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

export default function DealTable() {
  const dispatch = useAppDispatch();
  const deal = useAppSelector(store=>store.deal)

  useEffect(() => {
    dispatch(getAllDeals(localStorage.getItem("jwt")));
  }, [dispatch]); 

  const handleDelete = (id) => {
    dispatch(deleteDeal(id)); 
  };
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>No</StyledTableCell>
        
            <StyledTableCell align="right">Category</StyledTableCell>
            <StyledTableCell align="right">Discount %</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deal.deals.map((row, index) => (
            <StyledTableRow key={row._id}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              
              <StyledTableCell align="right">
                {row.category?.name || row.category}
              </StyledTableCell>
              <StyledTableCell align="right">{row.discount}%</StyledTableCell>
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
