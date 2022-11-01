import { passcodeNumbers } from "../../lib/constants";

const Numbers = ({ onChange }) => {
  const handleClick = (e, value) => {
    e.preventDefault();
    onChange((prevState) => [...prevState, value]);
  };

  return (
    <div className="passcode-middle-numbers">
      {passcodeNumbers.map((item) => (
        <div className="passcode-middle-numbers-buttons" key={item}>
          <button
            className="passcode-middle-numbers-buttons-button"
            type="button"
            onClick={(e) => handleClick(e, item)}
          >
            {item}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Numbers;
