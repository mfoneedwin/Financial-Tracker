import { useNavigate } from "react-router-dom";
import { ReactComponent as AddIcon } from "../assets/icons/add.svg";

const AddButton = () => {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate("/transaction/add");
  };
  return (
    <div className="addBtn">
      <button type="button" onClick={handleNavigate} className="addBtn-btn">
        <AddIcon />
      </button>
    </div>
  );
};

export default AddButton;
