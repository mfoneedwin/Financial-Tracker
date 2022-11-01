import { codeNumbers } from "../../lib/constants";

const Code = ({ length, error }) => {
  return (
    <div className={`passcode-top-code ${error ? "error" : ""}`}>
      {codeNumbers.map((item, i) => (
        <div
          key={item}
          className={`passcode-top-code-item ${i < length ? "active" : ""}`}
        />
      ))}
    </div>
  );
};

export default Code;
