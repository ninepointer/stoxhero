import React from "react";
import "./StarRating.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MDTypography from "../../../../components/MDTypography";

const StarRating = ({ rating }) => {
  // Round the rating to the nearest 0.5
  const roundedRating = Math.round(rating * 2) / 2;

  console.log("rating", rating, roundedRating);

  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < roundedRating) {
      stars.push(
        <i key={i} className="fas fa-star" style={{ color: "gold" }}></i>
      );
    } else if (i < Math.ceil(roundedRating) && roundedRating % 1 !== 0) {
      stars.push(
        <i key={i} className="fas fa-star-half-alt" style={{ color: "gold" }}></i>
      );
    } else {
      stars.push(
        <i key={i} className="far fa-star" style={{ color: "gold" }}></i>
      );
    }
  }

  return (
    <MDTypography variant="body3" fontWeight="bold" color='light' style={{ fontSize: 15 }}>
      <span style={{color: '#5B6A84'}} >{rating}</span> {stars}
    </MDTypography>
  );
};

export default StarRating;
