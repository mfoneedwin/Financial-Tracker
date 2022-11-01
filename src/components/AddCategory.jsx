import { addDoc } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import DataContext from "../context/DataContext";
import { categoriesCollection } from "../db/collections";
import { isOnlyOneEmoji } from "../lib/functions";
import FormItem from "./FormItem";
import Loader from "./Loader";

const defaultFormShape = [
  {
    id: 1,
    name: "name",
    label: "Category name",
    input: "input",
    required: true,
  },
  {
    id: 2,
    name: "emoji",
    label: "Emoji",
    input: "input",
    required: true,
  },
  {
    id: 3,
    name: "color",
    label: "Color",
    input: "colors",
    onSelect: () => {},
    required: true,
  },
];

const defaultData = {
  name: "",
  emoji: "",
  color: "",
};

const AddCategory = ({ onClose = () => {} }) => {
  const [formData, setFormData] = useState(defaultData);
  const [formShape, setFormShape] = useState(defaultFormShape);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { addCategory } = useContext(DataContext);

  useEffect(() => {
    const newFormShape = defaultFormShape.map((shape) => {
      if (shape.input === "colors") {
        return { ...shape, onSelect: handleSelect };
      }
      return shape;
    });

    setFormShape(newFormShape);
  }, []);

  const handleSelect = (color) => {
    setFormData((oldData) => ({ ...oldData, color }));
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emoji || !formData.name || !formData.color) {
      alert("All the fields are required");
      return;
    }

    const isEmoji = isOnlyOneEmoji(formData.emoji);
    if (!isEmoji) {
      alert("Please insert ONLY ONE EMOJI!");
      return;
    }

    setIsSubmiting(true);

    try {
      const categoryRef = await addDoc(categoriesCollection, formData);
      setIsSubmiting(false);

      const newCategory = { id: categoryRef.id, ...formData };
      addCategory(newCategory);
      handleClose();
    } catch (e) {
      setIsSubmiting(false);
      alert("An error occured!");
      console.error("Error adding document: ", e);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((oldData) => ({ ...oldData, [name]: value }));
  };

  return (
    <>
      <div className="addcategoryoverlay" onClick={handleClose} />
      <div className="addcategory">
        <h2 className="toptitle">New category</h2>
        <div className="form">
          {formShape.map((form) => (
            <FormItem
              key={form.id}
              data={form}
              formData={formData}
              onChange={onChange}
            />
          ))}
          <button
            type="button"
            disabled={isSubmiting}
            className="form-submit"
            onClick={handleSubmit}
          >
            {isSubmiting ? <Loader size="small" /> : "Save"}
          </button>
          <div className="form-buttons" onClick={handleClose}>
            <button type="button" className="form-buttons-back">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
