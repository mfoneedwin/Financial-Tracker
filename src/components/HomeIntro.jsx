import { useContext } from "react";
import { ReactComponent as IllustrationIcon } from "../assets/icons/illustration.svg";
import AuthContext from "../context/AuthContext";

const HomeIntro = () => {
  const { userConnected } = useContext(AuthContext);
  return (
    <div className="homeintro">
      <div className="homeintro-illustration">
        <IllustrationIcon />
      </div>
      <div className="homeintro-text">
        <h1>Welcome {userConnected?.username || ""}!</h1>
      </div>
    </div>
  );
};

export default HomeIntro;
