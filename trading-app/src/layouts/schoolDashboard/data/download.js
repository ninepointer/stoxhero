
export function downloadTotalList(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['FULL NAME','GRADE', 'DOB', 'JOINING DATE']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {
  
        return [
        elem?.full_name,
        elem?.grade,
        elem?.dob,
        elem?.joining_date,
    ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

export function downloadQuizRegisteredTotalList(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['FULL NAME','GRADE', 'DOB', 'REGISTRATION DATE']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {
  
        return [
        elem?.full_name,
        elem?.grade,
        elem?.dob,
        elem?.registration_date,
    ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

// board--> CBSE, ICSE, NIOS, CAIE, IB up, raj, bihar, delhi