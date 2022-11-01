import React from "react";
import { useNavigate } from "react-router-dom";
import FormItem from "./FormItem";
import Loader from "./Loader";

const Form = ({
  onSubmit,
  onChange,
  formShape = [],
  formData = {},
  isSubmiting = false,
  isEditing = false,
  hasReturn = false,
  canDelete = true,
  sizeDelete = "",
  onDelete = () => {},
}) => {
  const navigate = useNavigate();

  const goBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      {formShape.map((form) => (
        <FormItem
          key={form.id}
          data={form}
          formData={formData}
          onChange={onChange}
        />
      ))}
      <button type="submit" disabled={isSubmiting} className="form-submit">
        {isSubmiting ? <Loader size="small" /> : "Save"}
      </button>
      <div className="form-buttons">
        {hasReturn && (
          <button onClick={goBack} type="button" className="form-buttons-back">
            Cancel
          </button>
        )}
        {isEditing && canDelete && (
          <button
            type="button"
            className={`form-buttons-delete ${sizeDelete}`}
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default Form;
