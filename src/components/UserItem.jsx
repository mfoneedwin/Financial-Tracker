import { ReactComponent as UserIcon } from "../assets/icons/user.svg";

const UserItem = ({ data, onClick, userId = null }) => {
  if (!data) return;

  const { username, pin, id } = data || {};

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div
      className={`user ${userId === id ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="user-icon">
        <UserIcon />
      </div>
      <div className="user-details">
        <h2>{username}</h2>
        <p>{pin}</p>
      </div>
    </div>
  );
};

export default UserItem;
