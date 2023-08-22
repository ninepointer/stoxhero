import React, { useState } from "react";
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Stack,
  Chip
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";


export default function MultiSelectMaster({masterList}) {
  // console.log("collegeList", collegeList)
  // 
  const [selectedNames, setSelectedNames] = useState([]);
  console.log("selectedNames", selectedNames)
  return (
    <FormControl sx={{ m: 1, width: 500 }}>
      <InputLabel>Multiple Select</InputLabel>
      <Select
        multiple
        value={selectedNames}
        onChange={(e) => {
          console.log("value.......", e.target.value, [masterList.filter((elem) => elem.contestMasterMobile === (e.target.value[0]).split("-")[1].trim())[0]?._id])
          return setSelectedNames([masterList.filter((elem) => elem.contestMasterMobile === (e.target.value[0]).split("-")[1].trim())[0]?._id] )
        }}
        // onChange={(e) => setSelectedNames(e.target.value)}
        input={<OutlinedInput label="Multiple Select" />}
        renderValue={(selected) => (
          <Stack gap={1} direction="row" flexWrap="wrap">
            {selected.map((value) => (
              <Chip
                key={value}
                label={value}
                onDelete={() =>
                  setSelectedNames(
                    selectedNames.filter((item) => item !== value)
                  )
                }
                deleteIcon={
                  <CancelIcon
                    onMouseDown={(event) => event.stopPropagation()}
                  />
                }
              />
            ))}
          </Stack>
        )}
      >
        {masterList.map((elem) => (
          <MenuItem key={elem._id} value={elem?.contestMaster?.first_name+" "+elem?.contestMaster?.last_name+"-"+elem?.contestMasterMobile+"-"+elem?.inviteCode}>
            {elem?.contestMaster?.first_name+" "+elem?.contestMaster?.last_name+"-"+elem?.contestMasterMobile+"-"+elem?.inviteCode}
          </MenuItem>
        ))}
        
      </Select>
    </FormControl>
  );
}