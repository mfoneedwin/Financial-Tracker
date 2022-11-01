import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import UserItem from "../components/UserItem";
import { getUserRef, usersCollection } from "../db/collections";
import { onlyNumbers } from "../lib/functions";
import AuthContext from "../context/AuthContext";
import DataContext from "../context/DataContext";
import Form from "../components/Form";

const userForm = [
  {
    id: 1,
    name: "username",
    label: "User name",
    input: "input",
    required: true,
  },
  {
    id: 2,
    name: "pin",
    label: "PIN",
    input: "input",
    required: true,
  },
];

const userFormData = {
  username: "",
  pin: "",
};

const User = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userFormData);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const navigate = useNavigate();

  const { userConnected } = useContext(AuthContext);
  const { users, addUser, editUser, removeUser } = useContext(DataContext);

  useEffect(() => {
    if (userConnected?.username !== "Andrew") {
      navigate("/");
      return;
    }
  }, [navigate, userConnected]);

  const selectUser = (userId) => {
    if (userId === currentUser) {
      setCurrentUser(null);
      setIsEditing(false);
      setFormData(userFormData);
    } else {
      setCurrentUser(userId);
      setIsEditing(true);

      const currentUserData = users.find((user) => user.id === userId);
      const { username, pin } = currentUserData || {};
      if (currentUserData) setFormData({ username, pin });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // PIN validation
    if (!onlyNumbers(formData?.pin) || formData?.pin?.length !== 6) {
      alert("PIN must be 6 digits");
      return;
    }

    setIsSubmiting(true);

    if (isEditing) {
      try {
        const currentUserRef = await getUserRef(currentUser);
        await updateDoc(currentUserRef, formData);
        setIsSubmiting(false);
        setFormData(userFormData);
        const newUserData = { id: currentUser, ...formData };
        editUser(newUserData);
        setCurrentUser(null);
        setIsEditing(false);
      } catch (e) {
        setIsSubmiting(false);
        alert("An error occured!");
        console.error("Error adding document: ", e);
      }
    } else {
      try {
        const userRef = await addDoc(usersCollection, formData);
        setIsSubmiting(false);
        setFormData(userFormData);
        const newUser = { id: userRef.id, ...formData };
        addUser(newUser);
      } catch (e) {
        setIsSubmiting(false);
        alert("An error occured!");
        console.error("Error adding document: ", e);
      }
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    try {
      const currentUserRef = await getUserRef(currentUser);
      await deleteDoc(currentUserRef);
      setIsSubmiting(false);
      setFormData(userFormData);
      removeUser(currentUser);
      setCurrentUser(null);
      setIsEditing(false);
    } catch (e) {
      setIsSubmiting(false);
      alert("An error occured!");
      console.error("Error adding document: ", e);
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((oldData) => ({ ...oldData, [name]: value }));
  };

  return (
    <div className="page">
      <div className="subpage hasunder green cardcontainer">
        <h2 className="toptitle">{isEditing ? "Edit" : "Add"} user</h2>
        <Form
          onSubmit={handleSubmit}
          onChange={handleChange}
          onDelete={handleDelete}
          isEditing={isEditing}
          isSubmiting={isSubmiting}
          formData={formData}
          formShape={userForm}
          sizeDelete="small"
        />
      </div>
      <div className="subpage under gray billscontainer">
        <div className="title">
          <h2>Users</h2>
        </div>
        {users.map((user) => (
          <UserItem
            key={user.id}
            data={user}
            userId={currentUser}
            onClick={selectUser}
          />
        ))}
      </div>
    </div>
  );
};

export default User;
