
export function downloadAffiliate(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['NAME','CODE', 'NEW USERS', 
    'ACTIVE', 'PAID', 'TOTAL REVENUE', 
    'NEW USER REVENUE', 'OLD USER REVENUE', 
    'BONUS USED', 'SIGNUP BONUS', 'ACTUAL REVENUE']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {
  
        return [
        elem?.name,
        elem?.code,
        elem?.total,
        elem?.active,
        elem?.paid,
        elem?.revenue,
        elem?.newRevenue,
        elem?.oldRevenue,
        elem?.bonusUsed,
        elem?.bonus,
        elem?.actualRevenue,
    ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

export function downloadCareer(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['TYPE', 'NEW USERS', 
    'ACTIVE', 'PAID', 'TOTAL REVENUE', 
    'NEW USER REVENUE', 'OLD USER REVENUE', 
    'BONUS USED', 'SIGNUP BONUS', 'ACTUAL REVENUE']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {
  
        return [
        elem?.name,
        elem?.code,
        elem?.total,
        elem?.active,
        elem?.paid,
        elem?.revenue,
        elem?.newRevenue,
        elem?.oldRevenue,
        elem?.bonusUsed,
        elem?.bonus,
        elem?.actualRevenue,
    ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

export function downloadCampaign(data) {
  let csvDataFile = [[]]
  let csvDataDailyPnl = [['CODE', 'NEW USERS', 
  'ACTIVE', 'PAID', 'TOTAL REVENUE', 
  'NEW USER REVENUE', 'OLD USER REVENUE', 
  'BONUS USED', 'SIGNUP BONUS', 'ACTUAL REVENUE']]

  if (data) {
    let csvpnlData = Object.values(data)
    csvDataFile = csvpnlData?.map((elem) => {

      return [
      elem?.campaignCode,
      elem?.total,
      elem?.active,
      elem?.paid,
      elem?.revenue,
      elem?.newRevenue,
      elem?.oldRevenue,
      elem?.bonusUsed,
      elem?.bonus,
      elem?.actualRevenue,
  ]
    })
  }

  return [[...csvDataDailyPnl,...csvDataFile]]
}