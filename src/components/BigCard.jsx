import { ReactComponent as FlowerIcon } from "../assets/icons/flower.svg";
import { Link } from "react-router-dom";
import { formatNumber } from "../lib/functions";

const BigCard = ({ link = "", title = "", price = "0", color = "" }) => {
  return (
    <div className={`homecard-big ${color}`}>
      <div className="homecard-big-text">
        <p>{title}</p>
        <h2>{formatNumber(price)} Ar</h2>
      </div>
      {link && <Link to={link}>See transactions</Link>}
      <div className="homecard-big-illustration">
        <FlowerIcon />
      </div>
    </div>
  );
};

export default BigCard;
