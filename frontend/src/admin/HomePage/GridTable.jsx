import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HomeCategoryTable from "./HomeCategoryTable";
import { useAppSelector } from "../../Redux Toolkit/store";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}


const image =
  "https://image.hm.com/assets/hm/0e/1e/0e1e593d510f4498322997de971cc0623e70fa64.jpg?imwidth=2160";
export default function GridTable() {
   const homeCategories = useAppSelector(
        (store) => store.homeCategory.homeCategories,
      );
  return (
   <HomeCategoryTable categories={homeCategories?.GRID}/>
  );
}
