import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  CircularProgress,
  Pagination,
  TableRow,
} from "@mui/material";
import { columns } from "../columns";

export const StickyHeadTable = ({
  LaunchesDetails,
  rowsPerPage,
  err,
  isLoaded,
  onRowClick,
  page,
  handleChangeRowsPerPage,
  handleChangePage,
}) => {
  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 660, minHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody
              style={{ position: "relative" }}
              className="launchesBody"
            >
              {LaunchesDetails &&
                LaunchesDetails.slice(
                  (page - 1) * rowsPerPage,
                  (page - 1) * rowsPerPage + rowsPerPage
                ).map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      className="fail"
                      key={row.code}
                      onClick={() => onRowClick(row.No)}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];

                        return (
                          <TableCell key={column.id}>
                            <span
                              className={
                                ["Failure", "Success"].includes(value) &&
                                `status ${
                                  value === "Failure" ? "failure" : "success"
                                }`
                              }
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </span>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {isLoaded && (
                <div className="loader">
                  <CircularProgress color="inherit" />
                </div>
              )}
              {err && (
                <div className="error">
                  <p>No result found for the specified filter</p>
                </div>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <div
        style={{
          margin: "20px 0",
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          count={Math.round(LaunchesDetails.length / 12) + 1}
          page={page}
          onChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          variant="outlined"
          shape="rounded"
          defaultPage={3}
          siblingCount={0}
        />
      </div>
    </>
  );
};
