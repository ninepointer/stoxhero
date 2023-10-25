
export default function MapUserData() {



  return {
    columns: [
      { Header: "User Name", accessor: "name", align: "center" },
      { Header: "Enable Trading", accessor: "tradeEnable", align: "center"},
      { Header: "Real Trading", accessor: "realTrade", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },      
    ],

    rows: [
 
    ],
  };
}