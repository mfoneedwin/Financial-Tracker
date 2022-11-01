import { deleteDoc, getDoc } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import DataContext from "../context/DataContext";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow.svg";
import { ReactComponent as TrashIcon } from "../assets/icons/trash.svg";
import {
  formatNumber,
  getFormatedDateTime,
  convertNewline,
  getPayDate,
} from "../lib/functions";
import { getBillRef } from "../db/collections";

const BillsDetail = () => {
  const [bill, setBill] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { bills, updateBills, categories } = useContext(DataContext);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const billRef = await getBillRef(id);
      const billSnapshot = await getDoc(billRef);

      if (billSnapshot?.exists()) {
        const data = billSnapshot?.data();
        const refData = billSnapshot?.id;
        const bll = { ...data, id: refData };
        setBill(bll);
        setIsLoading(false);
      } else {
        navigate("/bill");
      }
    };

    if (bills.length > 0) {
      const currentBill = bills.find((bll) => bll.id === id);
      if (currentBill) setBill(currentBill);
      else navigate("/bill");
    } else {
      fetchData();
    }
  }, [id, bills, navigate]);

  const addTransaction = (e) => {
    e.preventDefault();
    const dataTransaction = {
      type: "out",
      title: bill?.title || "",
      price: bill?.price || "",
      category: bill?.category || "",
      description: bill?.description || "",
    };

    navigate("/transaction/add", { state: dataTransaction });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const currentBillRef = await getBillRef(id);
      await deleteDoc(currentBillRef);

      const newBills = bills.filter((bll) => bll.id !== id);
      updateBills(newBills);
      navigate("/bill");
    } catch (e) {
      setIsDeleting(false);
      alert("An error occured!");
      console.error("Error deleting document: ", e);
    }
  };

  const category = categories.find((cate) => cate.id === bill?.category);

  return (
    <div className="page">
      <div className="subpage hasunder green cardcontainer detailheader">
        <div className="detailheader-top">
          <div className="detailheader-top-back">
            <Link to={`/bill`}>
              <ArrowIcon />
            </Link>
          </div>
          <div className="detailheader-top-edit">
            <Link to={`/bill/${id}`}>Edit</Link>
          </div>
        </div>
        <h2>{bill?.title}</h2>
        <p>{getFormatedDateTime(bill?.date)}</p>
      </div>
      <div className="subpage under gray billscontainer">
        {isLoading ? (
          <div className="loadingContainer">
            <Loader />
          </div>
        ) : (
          <div className="itemdetail">
            <div className="itemdetail-details">
              <div className="itemdetail-details-categorycontainers">
                <div className="itemdetail-details-categorycontainers-price">
                  <h3>Price</h3>
                </div>
                <div className="itemdetail-details-categorycontainers-category">
                  <h3>{category?.name}</h3>
                  <p>Category</p>
                </div>
              </div>
              <div className="itemdetail-details-valuecontainers">
                <div className="itemdetail-details-valuecontainers-price">
                  <h2>{formatNumber(bill?.price || 0)} Ar</h2>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: `Every ${getPayDate(bill?.paydate)} of the month`,
                    }}
                  />
                </div>
                <div
                  className="itemdetail-details-valuecontainers-category"
                  style={{ backgroundColor: category?.color || "red" }}
                >
                  <div className="itemdetail-details-valuecontainers-category-container">
                    {category?.emoji || "🙁"}
                  </div>
                </div>
              </div>
            </div>
            {bill?.description && (
              <div className="itemdetail-description">
                <h2>Description</h2>
                <div className="itemdetail-description-content">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: convertNewline(bill?.description || ""),
                    }}
                  />
                </div>
              </div>
            )}
            <p className="itemdetail-created">
              Created by: {bill?.user?.username}
            </p>
            <button
              onClick={addTransaction}
              type="button"
              className="itemdetail-buy"
            >
              Pay Bill
            </button>
            <div className="itemdetail-delete">
              <button type="button" onClick={handleDelete}>
                {isDeleting ? <Loader size="small" /> : <TrashIcon />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillsDetail;
