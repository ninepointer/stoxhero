import { useEffect } from 'react';
import { useContext, useState } from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { userContext } from "../../AuthContext";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useLocation, useNavigate } from "react-router-dom";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { apiUrl } from '../../constants/constants';
import { BiFontSize } from 'react-icons/bi';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function CreateAffiliateProgram() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const getDetails = useContext(userContext);
  const location = useLocation();
  const id = location?.state?.data;
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(id?.eligibleProducts ? id?.eligibleProducts : []);
  const [selectedPlatform, setSelectedPlatform] = useState(id?.eligiblePlatforms ? id?.eligiblePlatforms : []);
  const [affiliateProgramData, setAffiliateProgramData] = useState(id ? id : '');
  const [isObjectNew, setIsObjectNew] = useState(id ? true : false)
  const [isLoading, setIsLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formState, setFormState] = useState({
    affiliateProgramName: id?.affiliateProgramName || '',
    description: id?.description || '',
    discountPercentage: id?.discountPercentage || '',
    commissionPercentage: id?.commissionPercentage || '',
    status: id?.status || 'Active',
    startDate: dayjs(id?.startDate) || dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    endDate: dayjs(id?.endDate) || dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59),
    eligibleProducts: id?.eligibleProducts || [],
    eligiblePlatforms: id?.eligiblePlatforms || [],
    maxDiscount: id?.maxDiscount || '',
    minOrderValue: id?.minOrderValue || '',
  });
  async function getProducts() {
    const res = await axios.get(`${apiUrl}products`, { withCredentials: true });
    if (res.status == 200) {
      setProducts(res?.data?.data?.filter((item) => item?.productName != 'Internship'));
    }
  }
  useEffect(() => {
    getProducts();
  }, [])

  async function onSubmit(e, formState) {
    e.preventDefault()
    console.log(formState)
    setCreating(true)

    if (!formState?.affiliateProgramName || !formState?.discountPercentage || !formState?.commissionPercentage || !formState?.status || !formState?.startDate || !formState?.endDate || !formState?.eligibleProducts.length || !formState?.eligiblePlatforms.length) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500);
      return openErrorSB("Missing Field", "Please fill all the mandatory fields");
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    const { affiliateProgramName, discountPercentage, commissionPercentage, status, startDate, endDate, eligibleProducts, description, maxDiscount, minOrderValue, eligiblePlatforms } = formState;
    const res = await fetch(`${apiUrl}affiliate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        affiliateProgramName, discountPercentage, commissionPercentage, status, startDate, endDate, eligibleProducts, description, maxDiscount, minOrderValue, eligiblePlatforms
      })
    });


    const data = await res.json();

    if (res.status === 201 || data) {
      openSuccessSB("Affiliate Program Created", data.message)
      setIsSubmitted(true)
      setAffiliateProgramData(data?.data)
      setIsObjectNew(true);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    } else {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
    }
  }


  async function onEdit(e, formState) {
    e.preventDefault()
    setSaving(true)
    if (!formState?.affiliateProgramName || !formState?.discountPercentage || !formState?.commissionPercentage || !formState?.status || !formState?.startDate || !formState?.endDate || !formState?.eligibleProducts.length || !formState?.eligiblePlatforms.length) {
      // setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500);
      return openErrorSB("Missing Field", "Please fill all the mandatory fields");
    }

    const { affiliateProgramName, discountPercentage, commissionPercentage, status, startDate, endDate, eligibleProducts, description, maxDiscount, minOrderValue, eligiblePlatforms } = formState;
    const res = await fetch(`${apiUrl}affiliate/${id?._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        affiliateProgramName, discountPercentage, commissionPercentage, status, startDate, endDate, eligibleProducts, description, maxDiscount, minOrderValue, eligiblePlatforms
      })

    });

    const data = await res.json();
    const updatedData = data?.data
    if (updatedData || res.status === 200) {
      openSuccessSB("Affiliate Program Edited", `Successfully Edited Affiliate Program`);
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
    } else {
      openErrorSB("Error", "data.error")
    }
  }


  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);


  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setErrorSB(true);
  }
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={title}
      content={content}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );
  const handleChange = (event) => {
    const selectedIds = event.target.value;
    setSelectedProduct(selectedIds);

    setFormState(prevState => ({
      ...prevState,
      eligibleProducts: selectedIds
    }));
  };
  const handlePlatformChange = (event) => {
    const selectedIds = event.target.value;
    setSelectedPlatform(selectedIds);

    setFormState(prevState => ({
      ...prevState,
      eligiblePlatforms: selectedIds
    }));
  };

  return (
    <>
      {isLoading ? (
        <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
          <CircularProgress color="info" />
        </MDBox>
      )
        :
        (
          <MDBox bgColor="light" color="dark" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
            <MDBox display="flex" mb={1} justifyContent="space-between" alignItems="center">
              <MDTypography color='dark' variant="caption" fontWeight="bold" textTransform="uppercase">
                Affiliate Program Details
              </MDTypography>
            </MDBox>

            <Grid container spacing={2} mt={0.5}>
              {/* Program Name */}
              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  label='Program Name *'
                  value={formState?.affiliateProgramName || editing ? formState?.affiliateProgramName : affiliateProgramData?.affiliateProgramName}
                  fullWidth
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      affiliateProgramName: e.target.value
                    }))
                  }}
                />
              </Grid>

              {/* Start Date */}
              <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['MobileDateTimePicker']}>
                    <DemoItem>
                      <MobileDateTimePicker
                        label="Start Date"
                        disabled={((isSubmitted || id) && (!editing || saving))}
                        value={formState?.startDate || dayjs(id?.startDate)}
                        onChange={(newValue) => {
                          if (newValue && newValue.isValid()) {
                            setFormState(prevState => ({ ...prevState, startDate: newValue }))
                          }
                        }}
                        minDateTime={null}
                        sx={{ width: '100%' }}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>

              {/* End Date */}
              <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['MobileDateTimePicker']}>
                    <DemoItem>
                      <MobileDateTimePicker
                        label="End Date"
                        disabled={((isSubmitted || id) && (!editing || saving))}
                        value={formState?.endDate || dayjs(id?.endDate)}
                        onChange={(newValue) => {
                          if (newValue && newValue.isValid()) {
                            setFormState(prevState => ({ ...prevState, endDate: newValue }))
                          }
                        }}
                        minDateTime={null}
                        sx={{ width: '100%' }}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Status*</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={formState?.status || affiliateProgramData?.status}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        status: e.target.value,
                      }));
                    }}
                    label="Status*"
                    sx={{
                      minHeight: 43,
                    }}
                  >
                    <MenuItem value={'Active'}>Active</MenuItem>
                    <MenuItem value={'Inactive'}>Inactive</MenuItem>
                    <MenuItem value={'Draft'}>Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Commission Percentage */}
              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  type="number"
                  label='Commission Percentage *'
                  value={formState?.commissionPercentage || editing ? formState?.commissionPercentage : affiliateProgramData?.commissionPercentage}
                  fullWidth
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      commissionPercentage: e.target.value
                    }))
                  }}
                />
              </Grid>

              {/* Discount Percentage */}
              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  type="number"
                  label='Discount Percentage*'
                  value={formState?.discountPercentage || editing ? formState?.discountPercentage : affiliateProgramData?.discountPercentage}
                  fullWidth
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      discountPercentage: e.target.value
                    }))
                  }}
                />
              </Grid>

              {/* Max Discount */}
              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  type="number"
                  label='Max Discount *'
                  value={formState?.maxDiscount || editing ? formState?.maxDiscount : affiliateProgramData?.maxDiscount}
                  fullWidth
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      maxDiscount: e.target.value
                    }))
                  }}
                />
              </Grid>

              {/* Min Order Value */}
              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  type="number"
                  label='Min Order Value *'
                  value={formState?.minOrderValue || editing ? formState?.minOrderValue : affiliateProgramData?.minOrderValue}
                  fullWidth
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      minOrderValue: e.target.value
                    }))
                  }}
                />
              </Grid>

              {/* Select Product */}
              <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{width:'100%'}}>
                  <InputLabel id="demo-multiple-checkbox-label">Select Products</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={selectedProduct}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selectedIds) =>
                      selectedIds.map(id => products.find(prod => prod._id === id)?.productName).join(', ')
                    }
                    sx={{ minHeight: "44px" }}
                    MenuProps={MenuProps}
                  >
                    {products?.map((elem) => (
                      <MenuItem key={elem?._id} value={elem?._id}>
                        <Checkbox checked={selectedProduct.indexOf(elem?._id) > -1} />
                        <ListItemText primary={elem?.productName} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Eligible Platform */}
              <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{width:'100%'}}>
                  <InputLabel id="demo-multiple-checkbox-label">Eligible Platforms</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={selectedPlatform}
                    onChange={handlePlatformChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selectedIds) =>
                      selectedIds.map(id => id).join(', ')
                      // console.log(selectedIds)
                    }
                    sx={{ minHeight: "44px" }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem key={1} value='Web'>
                        <Checkbox checked={selectedPlatform.indexOf('Web') > -1} />
                        <ListItemText primary={'Web'} />
                      </MenuItem>
                      <MenuItem key={2} value='Android'>
                        <Checkbox checked={selectedPlatform.indexOf('Android') > -1} />
                        <ListItemText primary={'Android'} />
                      </MenuItem>
                      <MenuItem key={3} value='iOS'>
                        <Checkbox checked={selectedPlatform.indexOf('iOS') > -1} />
                        <ListItemText primary={'iOS'} />
                      </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
              <Grid item xs={12} md={6} xl={6}>
                <TextField
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  id="outlined-required"
                  label='Description *'
                  value={formState?.description || editing ? formState?.description : affiliateProgramData?.description}
                  fullWidth
                  multiline
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      description: e.target.value
                    }))
                  }}
                />
              </Grid> 

              <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={12} xl={12}>
                {!isSubmitted && !isObjectNew && (
                  <>
                    <MDButton mr={1} variant="contained" color="success" size="small" sx={{ mr: 1, ml: 2 }} disabled={creating} onClick={(e) => { onSubmit(e, formState) }}>
                      {creating ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/affiliateprograms") }}>
                      Cancel
                    </MDButton>
                  </>
                )}

                {(isSubmitted || id) && !editing && (
                  <>
                    <MDButton sx={{ mr: 1, ml: 2 }} variant="contained" color="info" size="small" disabled={editing} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={editing} onClick={() => { navigate("/affiliateprograms") }}>
                      Back
                    </MDButton>
                  </>
                )}

                {(isSubmitted || id) && editing && (
                  <>
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} disabled={saving}
                      onClick={(e) => { onEdit(e, formState) }}

                    >
                      {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={() => { setEditing(false) }}>
                      Cancel
                    </MDButton>
                  </>
                )}
              </Grid>

            </Grid>
            {renderSuccessSB}
            {renderErrorSB}
          </MDBox>
        )
      }
    </>
  )
}
export default CreateAffiliateProgram;