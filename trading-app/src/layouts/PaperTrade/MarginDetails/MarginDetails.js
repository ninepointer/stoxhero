
export default function MarginDetails() {

  return {
    columns: [
      { Header: "Opening Balance", accessor: "OpeningBalance", align: "center" },
      { Header: "Available Margin", accessor: "AvailableMargin", align: "center" },
      { Header: "Used Margin", accessor: "UsedMargin", align: "center" },
      { Header: "Available Cash", accessor: "AvailableCash", align: "center" },
      { Header: "Total Credits", accessor: "TotalCredits", align: "center" },
    ],

    rows: [],
  };
}
