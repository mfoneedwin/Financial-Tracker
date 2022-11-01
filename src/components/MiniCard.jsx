import { ReactComponent as ArrowIcon } from "../assets/icons/arrow.svg";
import { formatNumber } from "../lib/functions";

const MiniCard = ({ title = "", price = 0, effect = "", direction = "" }) => {
  return (
    <div className={`homecard-small-mini ${effect}`}>
      <div className={`homecard-small-mini-icon ${direction}`}>
        <ArrowIcon />
      </div>
      <div className="homecard-small-mini-content">
        <p>{title}</p>
        <h2>{formatNumber(price)} Ar</h2>
      </div>
    </div>
  );
};

export default MiniCard;
