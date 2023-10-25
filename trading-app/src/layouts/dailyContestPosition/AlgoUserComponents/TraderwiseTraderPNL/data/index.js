
export default function data() {
    
  return {
    columns: [
      { Header: "Trader Name", accessor: "traderName", width: "15%", align: "center" },
      { Header: "Gross P&L", accessor: "grossPnl", width: "12.5%", align: "center" },
      { Header: "# of Trades", accessor: "noOfTrade", width: "12.5%", align: "center" },
      { Header: "Running Lots", accessor: "runningLots", width: "12.5%", align: "center" },
      { Header: "Lots Used", accessor: "lotUsed", width: "12.5%", align: "center" },
      { Header: "Brokerage", accessor: "brokerage", width: "12.5%", align: "center" },
      { Header: "Net P&L", accessor: "netPnl", width: "12.5%", align: "center" },
      { Header: "Email", accessor: "email", width: "12.5%", align: "center" },
      { Header: "Mobile", accessor: "mobile", width: "12.5%", align: "center" },

    ],

    rows: [
      

    ],


  };
}
