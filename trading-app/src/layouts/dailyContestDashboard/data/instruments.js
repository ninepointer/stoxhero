
export default function instrumentdata() {
    
  return {
    columns: [
      { Header: "Instrument", accessor: "instrument", width: "15%", align: "center" },
      { Header: "Quantity", accessor: "quantity", width: "14.1%", align: "center" },
      { Header: "Avg. Price", accessor: "avgproce", width: "14.1%", align: "center" },
      { Header: "LTP", accessor: "ltp", width: "14.1%", align: "center" },
      { Header: "Gross P&L", accessor: "grossPnl", width: "14.1%", align: "center" },
      { Header: "Brokerage", accessor: "brokerage", width: "14.1%", align: "center" },
      { Header: "Change(%)", accessor: "change", width: "14.1%", align: "center" },

    ],

    rows: [
      

    ],


  };
}
