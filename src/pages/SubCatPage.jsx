/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Snackbar,
} from '@mui/material';

import axios from 'axios';
// components
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import {getData} from '../_mock/blog';

import CustomizedDialogs from './Dialog'
import CustomizedDialogs2 from './Dialog2'
import CatForm from './CatForm'

import base_url from '../apis';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Category Name', alignRight: false },
  { id: 'visibility', label: 'Visibility', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'createdAt', label: 'CreatedAt', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.cat_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SubCatPage(cat_props) {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('desc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('createdAt');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [user_data, setUsersData] = useState([]);

  const [img_obj, setImgObj] = useState({});

  const [open_msg, setMsgOpen] = useState(false);

  let msg_text = sessionStorage.getItem('msg');
  let msg_success = sessionStorage.getItem('success');
  let msg_show_msg = sessionStorage.getItem('show_msg');

  if(msg_show_msg == "true"){
    setMsgOpen(true);
    sessionStorage.setItem('show_msg', false);
  }

  useEffect( () => {
    userData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleOpenMenu = (event,data) => {
    setOpen(event.currentTarget);
    setImgObj(data);
    
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const userData = async() => {
   // let data = await getData();
    
    let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
        const result = await axios.get(`${base_url}admin/react_subcat/${cat_props.id}`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + jwt_token,
          }
        });

    setUsersData(result.data.cat)
  };
  const handleClose = () => {
    setMsgOpen(false);
    sessionStorage.setItem('show_msg', false);
  }
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = user_data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = async(event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user_data.length) : 0;

  const filteredUsers = applySortFilter(user_data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Sub Category | Post-Art </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Sub Category
          </Typography>
          <Button variant="outlined" >
            <Iconify icon={'material-symbols:add'} />&nbsp;
            <CustomizedDialogs title="Add Sub Category" type="Sub Category">
            <CatForm  />
          </CustomizedDialogs>
            </Button>
          
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={user_data.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, cat_name, visibility,date, image_url, createdAt, } = row;
                    const selectedUser = selected.indexOf(cat_name) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, cat_name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={cat_name} src={image_url} />
                            <Typography variant="subtitle2" noWrap>
                              {cat_name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{(visibility == 1) ? 'TRUE' : 'FALSE'}</TableCell>

                        <TableCell align="left">{new Date(date).toDateString()}</TableCell>

                        <TableCell align="left">{new Date(createdAt).toDateString()}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={user_data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem sx={{ color: 'green' }}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          <CustomizedDialogs title={"Edit"} type="Sub Category">
            <CatForm 
              id={img_obj._id}
              cat_name={img_obj.cat_name}
              visibility={img_obj.visibility}
              avatarUrl={img_obj.image_url}
              cat_id={img_obj.parent_category_id}
              date={img_obj.date}
             />
          </CustomizedDialogs>
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 3 }} />
          <CustomizedDialogs2 type="Category">
            {img_obj._id}
          </CustomizedDialogs2>
        </MenuItem>
      </Popover>
      {
        (msg_success == "200") ? <Snackbar
        anchorOrigin={{ vertical : 'top', horizontal : 'center' }}
        open={open_msg}
        onClose={handleClose}
        message={msg_text}
        key={'topcenter'}
        autoHideDuration={4000}
        ContentProps={{
          sx: {
            background: 'green',
          }
        }}
      /> : <Snackbar
        anchorOrigin={{ vertical : 'top', horizontal : 'center' }}
        open={open_msg}
        onClose={handleClose}
        message={msg_text}
        key={'topcenter'}
        autoHideDuration={4000}
        ContentProps={{
          sx: {
            background: 'red',
          }
        }}
      />
      }
      
    </>
  );
}
