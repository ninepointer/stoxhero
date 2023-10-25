export default function AllReferrals() {



    return {
      columns: [
        { Header: "Full Name", accessor: "fullName",align: "center" },
        { Header: "Mobile No.", accessor: "mobile", align: "center"},
        { Header: "Date of Joining", accessor: "doj", align: "center"},
      ],
  
      rows: [],
    };
  }