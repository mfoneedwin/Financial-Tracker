import {
  addDoc,
  deleteDoc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Form from "../components/Form";
import AuthContext from "../context/AuthContext";
import DataContext from "../context/DataContext";
import {
  getBalanceRef,
  getTransactionRef,
  getWhishlistRef,
  transactionsCollection,
} from "../db/collections";
import { onlyNumbers } from "../lib/functions";

const defaultFormShape = [
  {
    id: 5,
    name: "type",
    label: "Type",
    input: "types",
    required: true,
    onSelect: () => {},
  },
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
  type: "",
  title: "",
  price: "",
  category: "",
  description: "",
};

const TransactionsManage = () => {
  const [formData, setFormData] = useState(defaultData);
  const [formShape, setFormShape] = useState(defaultFormShape);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);

  const { userConnected } = useContext(AuthContext);
  const {
    transactions,
    updateTransactions,
    whishlists,
    updateWhishlists,
    homeTransactions,
    updateHomeTransactions,
    balance,
    updateBalance,
  } = useContext(DataContext);

  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsSubmiting(true);
      const transactionRef = await getTransactionRef(id);
      const transactionSnapshot = await getDoc(transactionRef);

      if (transactionSnapshot?.exists()) {
        const data = transactionSnapshot?.data();
        const refData = transactionSnapshot?.id;
        const tran = { ...data, id: refData };
        setCurrentPrice(parseInt(tran?.price || 0, 10) || 0);
        setFormData(tran);
        setIsSubmiting(false);
      } else {
        navigate(`/transaction/${id}/view`);
      }
    };

    const newFormShape = defaultFormShape.map((shape) => {
      if (shape.input === "types") {
        return { ...shape, onSelect: handleSelect };
      }
      return shape;
    });

    setFormShape(newFormShape);

    if (id === "add") {
      if (state) {
        setCurrentPrice(parseInt(state?.price || 0, 10) || 0);
        setFormData(state);
      }

      setIsEditing(false);
    } else {
      if (transactions.length > 0) {
        const currentTransaction = transactions.find((tran) => tran.id === id);
        if (currentTransaction) {
          setCurrentPrice(parseInt(currentTransaction?.price || 0, 10) || 0);
          setFormData(currentTransaction);
        } else navigate(`/transaction/${id}/view`);
      } else {
        fetchData();
      }
      setIsEditing(true);
    }
  }, [id, navigate, transactions, state]);

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
    if (!formData?.type) {
      alert("Please select a type.");
      return;
    }

    setIsSubmiting(true);

    if (isEditing) {
      try {
        const currentTransactionRef = await getTransactionRef(id);
        await updateDoc(currentTransactionRef, formData);
        const newTransactions = transactions.map((tran) => {
          if (tran.id === id) return { ...tran, ...formData };
          return tran;
        });

        updateTransactions(newTransactions);

        const newHomeTransactions = homeTransactions.map((tran) => {
          if (tran.id === id) return { ...tran, ...formData };
          return tran;
        });
        updateHomeTransactions(newHomeTransactions);

        // Update Balance
        const oldPrice = parseInt(balance?.price || 0, 10);
        const thePrice = parseInt(formData?.price || 0, 10);
        const diff = currentPrice - thePrice;
        let newPrice = oldPrice;

        // in
        // 23 - 24 = -1 => balance miampy
        // 23 - 22 = 1 => balance mihena

        // out
        // 23 - 24 = -1 => balance mihena
        // 23 - 22 = 1 => balance miampy

        if (formData.type === "in") {
          if (diff > 0) newPrice = oldPrice - Math.abs(diff);
          else newPrice = oldPrice + Math.abs(diff);
        } else {
          if (diff > 0) newPrice = oldPrice + Math.abs(diff);
          else newPrice = oldPrice - Math.abs(diff);
        }

        const newBalance = { oldPrice, price: newPrice };

        const balanceRef = await getBalanceRef();
        await updateDoc(balanceRef, newBalance);

        updateBalance(newBalance);

        navigate(`/transaction/${id}/view`);
      } catch (e) {
        setIsSubmiting(false);
        alert("An error occured!");
        console.error("Error editing document: ", e);
      }
    } else {
      try {
        formData.date = Timestamp.fromDate(new Date());
        formData.user = userConnected;

        const transactionRef = await addDoc(transactionsCollection, formData);
        const newTransactions = [
          { id: transactionRef.id, ...formData },
          ...transactions,
        ];
        updateTransactions(newTransactions);

        const newHomeTransactions = [
          { id: transactionRef.id, ...formData },
          ...homeTransactions,
        ];
        updateHomeTransactions(newHomeTransactions);

        // Update Balance
        const oldPrice = parseInt(balance?.price || 0, 10);
        const thePrice = parseInt(formData?.price || 0, 10);
        let newPrice;

        if (formData.type === "in") newPrice = oldPrice + thePrice;
        else newPrice = oldPrice - thePrice;
        const newBalance = { oldPrice, price: newPrice };

        const balanceRef = await getBalanceRef();
        await updateDoc(balanceRef, newBalance);

        updateBalance(newBalance);

        // delete from whishlist
        if (state?.whishlist) {
          try {
            const currentWhishlistRef = await getWhishlistRef(state?.whishlist);
            await deleteDoc(currentWhishlistRef);
            const newWishlist = whishlists.filter(
              (whs) => whs.id !== state?.whishlist
            );
            updateWhishlists(newWishlist);
            navigate("/transaction");
          } catch (e) {
            setIsSubmiting(false);
            alert("An error occured!");
            console.error("Error deleting document: ", e);
          }
        }

        navigate("/transaction");
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

  const handleSelect = (type) => {
    setFormData((oldData) => ({ ...oldData, type }));
  };

  return (
    <div className="page">
      <div className="whishlist">
        <h2 className="toptitle">{isEditing ? "Edit" : "Add"} Transaction</h2>
        <Form
          hasReturn
          returnLink={`/transaction${id === "add" ? "" : `/${id}/view`}`}
          formShape={formShape}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isEditing={isEditing}
          isSubmiting={isSubmiting}
          canDelete={false}
        />
      </div>
    </div>
  );
};

export default TransactionsManage;
