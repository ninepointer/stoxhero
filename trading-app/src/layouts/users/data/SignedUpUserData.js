
// Images

export default function AllActiveUsers() {

  return {
    columns: [
      { Header: "Full Name", accessor: "name",align: "center" },
      // { Header: "Last Name", accessor: "lname", align: "center"},
      { Header: "Email", accessor: "email", align: "center"},
      { Header: "Mobile No.", accessor: "mobile", align: "center"},
      { Header: "Status", accessor: "status", align: "center"},
    ],

    rows: [],
  };
}