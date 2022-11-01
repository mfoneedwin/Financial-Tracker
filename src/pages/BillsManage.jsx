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
import { billsCollection, getBillRef } from "../db/collections";
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
    label: "Price",
    input: "input",
    required: true,
  },
  {
    id: 5,
    name: "paydate",
    label: "Payment date (date between 1 - 31)",
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
  paydate: "",
  category: "",
  description: "",
};

const BillsManage = () => {
  const [formData, setFormData] = useState(defaultData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { userConnected } = useContext(AuthContext);
  const { bills, updateBills } = useContext(DataContext);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsSubmiting(true);
      const billRef = await getBillRef(id);
      const billSnapshot = await getDoc(billRef);

      if (billSnapshot?.exists()) {
        const data = billSnapshot?.data();
        const refData = billSnapshot?.id;
        const bll = { ...data, id: refData };
        setFormData(bll);
        setIsSubmiting(false);
      } else {
        navigate(`/bill/${id}/view`);
      }
    };

    if (id === "add") {
      setIsEditing(false);
    } else {
      if (bills.length > 0) {
        const currentBill = bills.find((bll) => bll.id === id);
        if (currentBill) setFormData(currentBill);
        else navigate(`/bill/${id}/view`);
      } else {
        fetchData();
      }
      setIsEditing(true);
    }
  }, [id, navigate, bills]);

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
    if (!onlyNumbers(formData?.paydate)) {
      alert("The Payment date must contain only digits.");
      return;
    }
    if (
      parseInt(formData?.paydate, 10) > 31 ||
      parseInt(formData?.paydate, 10) < 1
    ) {
      alert("The Payment date must be between 1 - 31.");
      return;
    }

    setIsSubmiting(true);

    if (isEditing) {
      try {
        const currenyBillRef = await getBillRef(id);
        await updateDoc(currenyBillRef, formData);
        setIsSubmiting(false);
        const newBills = bills.map((bll) => {
          if (bll.id === id) return { ...bll, ...formData };
          return bll;
        });
        updateBills(newBills);
        navigate(`/bill/${id}/view`);
      } catch (e) {
        setIsSubmiting(false);
        alert("An error occured!");
        console.error("Error adding document: ", e);
      }
    } else {
      try {
        formData.date = Timestamp.fromDate(new Date());
        formData.user = userConnected;

        const billRef = await addDoc(billsCollection, formData);
        setIsSubmiting(false);
        const newBills = [...bills, { id: billRef.id, ...formData }];
        updateBills(newBills);
        navigate("/bill");
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
      const currentBillRef = await getBillRef(id);
      await deleteDoc(currentBillRef);
      setIsSubmiting(false);

      const newBills = bills.filter((bll) => bll.id !== id);
      updateBills(newBills);
      navigate("/bill");
    } catch (e) {
      setIsSubmiting(false);
      alert("An error occured!");
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="page">
      <div className="whishlist">
        <h2 className="toptitle">{isEditing ? "Edit" : "Add"} Bill</h2>
        <Form
          hasReturn
          returnLink={`/bill${id === "add" ? "" : `/${id}/view`}`}
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

export default BillsManage;
