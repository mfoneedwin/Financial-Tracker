import {
  addDoc,
  deleteDoc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../components/Form";
import AuthContext from "../context/AuthContext";
import DataContext from "../context/DataContext";
import { getWhishlistRef, whishlistsCollection } from "../db/collections";
import { onlyNumbers } from "../lib/functions";

const formShape = [
  {
    id: 4,
    name: "title",
    label: "Title",
    input: "input",
    required: true,
  },
  {
    id: 1,
    name: "price",
    label: "Aprox price",
    input: "input",
    required: true,
  },
  {
    id: 2,
    name: "category",
    label: "Category",
    input: "category",
    required: true,
  },
  {
    id: 3,
    name: "description",
    label: "Description",
    input: "textarea",
  },
];

const defaultData = {
  title: "",
  price: "",
  category: "",
  description: "",
};

const WhishlistManage = () => {
  const [formData, setFormData] = useState(defaultData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { userConnected } = useContext(AuthContext);
  const { whishlists, updateWhishlists } = useContext(DataContext);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsSubmiting(true);
      const whishlistRef = await getWhishlistRef(id);
      const whishlistSnapshot = await getDoc(whishlistRef);

      if (whishlistSnapshot?.exists()) {
        const data = whishlistSnapshot?.data();
        const refData = whishlistSnapshot?.id;
        const whsl = { ...data, id: refData };
        setFormData(whsl);
        setIsSubmiting(false);
      } else {
        navigate(`/whishlist/${id}/view`);
      }
    };

    if (id === "add") {
      setIsEditing(false);
    } else {
      if (whishlists.length > 0) {
        const currentWhishlist = whishlists.find((whl) => whl.id === id);
        if (currentWhishlist) setFormData(currentWhishlist);
        else navigate(`/whishlist/${id}/view`);
      } else {
        fetchData();
      }
      setIsEditing(true);
    }
  }, [id, navigate, whishlists]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData?.category) {
      alert("Please select a category.");
      return;
    }
    if (!onlyNumbers(formData?.price)) {
      alert("The price must contain only digits.");
      return;
    }

    setIsSubmiting(true);

    if (isEditing) {
      try {
        const currentWhishlistRef = await getWhishlistRef(id);
        await updateDoc(currentWhishlistRef, formData);
        const newWishlist = whishlists.map((whs) => {
          if (whs.id === id) return { ...whs, ...formData };
          return whs;
        });
        updateWhishlists(newWishlist);
        navigate(`/whishlist/${id}/view`);
      } catch (e) {
        setIsSubmiting(false);
        alert("An error occured!");
        console.error("Error adding document: ", e);
      }
    } else {
      try {
        formData.date = Timestamp.fromDate(new Date());
        formData.user = userConnected;

        const whishlistRef = await addDoc(whishlistsCollection, formData);
        const newWishlist = [
          ...whishlists,
          { id: whishlistRef.id, ...formData },
        ];
        updateWhishlists(newWishlist);
        navigate("/whishlist");
      } catch (e) {
        setIsSubmiting(false);
        alert("An error occured!");
        console.error("Error adding document: ", e);
      }
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((oldData) => ({ ...oldData, [name]: value }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    setIsSubmiting(true);
    try {
      const currentWhishlistRef = await getWhishlistRef(id);
      await deleteDoc(currentWhishlistRef);

      const newWishlist = whishlists.filter((whs) => whs.id !== id);
      updateWhishlists(newWishlist);
      navigate("/whishlist");
    } catch (e) {
      setIsSubmiting(false);
      alert("An error occured!");
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="page">
      <div className="whishlist">
        <h2 className="toptitle">{isEditing ? "Edit" : "Add"} Whishlist</h2>
        <Form
          hasReturn
          returnLink={`/whishlist${id === "add" ? "" : `/${id}/view`}`}
          formShape={formShape}
          formData={formData}
          onDelete={handleDelete}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isEditing={isEditing}
          isSubmiting={isSubmiting}
        />
      </div>
    </div>
  );
};

export default WhishlistManage;
