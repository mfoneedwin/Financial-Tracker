import { useState, useEffect, useContext } from "react";

import Code from "./Code";
import Numbers from "./Numbers";
import AuthContext from "../../context/AuthContext";
import DataContext from "../../context/DataContext";

const PassCode = () => {
  const { checkPasscode } = useContext(AuthContext);
  const { users } = useContext(DataContext);
  const [passCode, setpassCode] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (passCode.length === 1) {
      setHasError(false);
    }

    if (passCode.length === 6) {
      const stringPasscode = passCode.join("");
      const isOK = checkPasscode(stringPasscode, users);
      if (!isOK) {
        setHasError(true);
        setpassCode([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passCode]);

  const handleDelete = (e) => {
    e.preventDefault();
    setpassCode((prevState) => {
      const newData = [...prevState];
      newData.pop();
      return newData;
    });
  };

  return (
    <div className="passcode">
      <div className="passcode-top">
        <h3 className="passcode-top-text">Enter passcode</h3>
        <Code length={passCode.length} error={hasError} />
      </div>
      <div className="passcode-middle">
        <Numbers onChange={setpassCode} />
      </div>
      <div className="passcode-bottom">
        {!!passCode.length && (
          <div className="passcode-bottom-container">
            <button
              className="passcode-bottom-button"
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassCode;
