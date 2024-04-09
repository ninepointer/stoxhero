import * as React from 'react';
import {useState, useEffect} from 'react';
import {Paper, CircularProgress, Table, TableBody, Typography, Box} from '@mui/material';
import {TableCell, TableContainer, TablePagination, TableRow, Grid} from '@mui/material';
import axios from 'axios';
import {apiUrl} from '../../../constants/constants';

const columns = [
  { id: 'rank', label: 'Rank', minWidth: 50, align: 'center' },
  { id: 'name', label: 'Name', minWidth: 150, align: 'center' },
  { id: 'grossPnl', label: 'Gross P&L', minWidth: 150, align: 'center' },
  {id: 'brokerage', label: 'Brokerage', minWidth: 100, align: 'center'},
  {id: 'netPnl', label: 'Net P&L', minWidth: 150, align: 'center'},
  {id: 'roi', label: 'ROI%', minWidth: 100, align: 'center'},
  {id: 'margin', label: 'Margin Used', minWidth: 170, align: 'center'},
  {id: 'trades', label: '# of Trades', minWidth: 120, align: 'center'}
];


export default function LeaderboardTable({value}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const url = value===`Today's` ? 'todayleaderboard'
            : value===`Weekly` ? `weekleaderboard`
            : value===`Monthly` && `monthleaderboard`;

  useEffect(()=>{
    getData();
  }, [value]);

  async function getData(){
    setLoading(true);
    setData([]);
    try{
      const data = await axios.get(`${apiUrl}paperTrade/${url}`, {withCredentials: true});
      setData(data?.data?.data);
      setLoading(false);
    } catch(err){
      setLoading(false);
      console.log(err);
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value)
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = [];
  for (const [index, elem] of data.entries()) {
    const obj = {};
    for(const subelem in elem){
      const color = elem[subelem] > 0 ? 'success'
            : elem[subelem] < 0 ? 'error'
            : 'text';
      obj[subelem] = elem[subelem];
      obj.rank = index+1;
      obj.name = elem?.name ? (elem?.name || 'Vijay Verma') : ((elem?.trader?.first_name || 'Vijay') + " " + (elem?.trader?.last_name || 'Verma'));
      obj[`${subelem}-color`] = color;
    }

    rows.push(obj);
  }

  return (
    <>
      {
        loading ?
          <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
            <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
              <Box mt={5} mb={5}>
                <CircularProgress color="info" />
              </Box>
            </Grid>
          </Grid>
          :
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography align={'center'} p={1} style={{ backgroundColor: 'lightgrey', fontSize: '15px', fontWeight: 600, borderBottom: '.2px solid black' }}>
              {`${value} Leaderboard`}
            </Typography>
            {data.length > 0 ?
              <>
                <TableContainer sx={{ maxHeight: 'auto' }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableBody style={{ position: 'sticky', top: '0', borderRadius: 0, }}>

                      <TableRow style={{ borderRadius: 0, backgroundColor: 'white' }}>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, fontSize: '15px', fontWeight: 600 }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                    <TableBody>
                      {rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                              {columns.map((column) => {
                                let value = row[column.id];
                                let color = '#868AA2';
                                if (column.id === 'grossPnl' || column.id === 'netPnl' || column.id === 'roi') {
                                  color = value >= 0 ? '#54B258'
                                    : value < 0 && '#F5594D';
                                }

                                if (column.id === 'grossPnl' || column.id === 'netPnl') {
                                  value = (value) >= 0
                                    ? "+₹" +
                                    new Intl.NumberFormat(undefined, {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }).format((value))
                                    : "-₹" +
                                    new Intl.NumberFormat(undefined, {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }).format(-(value))
                                }

                                if (column.id === 'brokerage' || column.id === 'margin') {
                                  value = "₹" +
                                    new Intl.NumberFormat(undefined, {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }).format((value));
                                }

                                if (column.id === 'roi') {
                                  value = value > 0 ? "+" + value?.toFixed(2) : value?.toFixed(2);
                                }
                                return (
                                  <TableCell key={column.id} align={column.align} style={{ color: color, fontSize: '14px', fontWeight: 500 }}>
                                    {value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 50, 100, 200, 500, 1000, 2000, 5000, 10000]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
              :
              <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
                <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                  <Box mt={5} mb={5}>
                    {`No ${value} Data`}
                  </Box>
                </Grid>
              </Grid>
            }
          </Paper>
      }
    </>
  );
}
