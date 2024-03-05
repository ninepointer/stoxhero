import React from "react";
import "./StarRating.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MDTypography from "../../../../components/MDTypography";

const StarRating = ({ rating }) => {
  // Round the rating to the nearest 0.5
  const roundedRating = (Math.round(rating) === rating) ? rating : Math.round((rating - 1) * 2) / 2;

  // Create an array of stars based on the rounded rating
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < roundedRating) {
      // If the index is less than the rounded rating, show a filled star
      stars.push(
        <i key={i} className="fas fa-star" style={{ color: "gold" }}></i>
      );
    } else if (i === Math.ceil(roundedRating) && roundedRating % 1 !== 0) {
      // If the index is equal to the rounded rating and the rounded rating is not a whole number, show a half-filled star
      stars.push(
        <i
          key={i}
          className="fas fa-star-half-alt"
          style={{ color: "gold" }}
        ></i>
      );
    } else {
      // Otherwise, show an empty star
      stars.push(
        <i key={i} className="far fa-star" style={{ color: "gold" }}></i>
      );
    }
  }

  return (
    <MDTypography variant="body3" fontWeight="bold" style={{ fontSize: 15 }}>
      {rating} {stars}
    </MDTypography>
  );
};

export default StarRating;
