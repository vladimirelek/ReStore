import { Box, Typography, Pagination } from "@mui/material";
import { useAppSelector } from "../store/store";
import { MetaData } from "../models/pagination";
interface Props {
  metaData: MetaData;
  onPageChange: (page: number) => void;
}
const AppPagination = ({ metaData, onPageChange }: Props) => {
  //   const { metaData } = useAppSelector((state) => state.catalog);
  const { pageSize, currentPage, totalCount, totalPages } = metaData;
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography>
        Displaying {(currentPage - 1) * pageSize + 1}-
        {currentPage * pageSize > totalCount
          ? totalCount
          : currentPage * pageSize}{" "}
        of {totalCount} results
      </Typography>
      <Pagination
        color="secondary"
        size="large"
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
      />
    </Box>
  );
};
export default AppPagination;
