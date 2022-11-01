import { getDoc } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import DataContext from "../context/DataContext";
import { getTransactionRef } from "../db/collections";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow.svg";

import {
  formatNumber,
  getFormatedDateTime,
  convertNewline,
} from "../lib/functions";

const TransactionsDetail = () => {
  const [transaction, setTransaction] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { transactions, categories } = useContext(DataContext);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const transactionRef = await getTransactionRef(id);
      const transactionSnapshot = await getDoc(transactionRef);

      if (transactionSnapshot?.exists()) {
        const data = transactionSnapshot?.data();
        const refData = transactionSnapshot?.id;
        const tra = { ...data, id: refData };
        setTransaction(tra);
        setIsLoading(false);
      } else {
        navigate("/transaction");
      }
    };

    if (transactions.length > 0) {
      const currentTransaction = transactions.find((tra) => tra.id === id);
      if (currentTransaction) setTransaction(currentTransaction);
      else navigate("/transaction");
    } else {
      fetchData();
    }
  }, [id, transactions, navigate]);

  const category = categories.find((cate) => cate.id === transaction?.category);

  return (
    <div className="page">
      <div className="subpage hasunder green cardcontainer detailheader">
        <div className="detailheader-top">
          <div className="detailheader-top-back">
            <Link to={`/transaction`}>
              <ArrowIcon />
            </Link>
          </div>
          <div className="detailheader-top-edit">
            <Link to={`/transaction/${id}`}>Edit</Link>
          </div>
        </div>
        <h2>{transaction?.title}</h2>
        <p>{getFormatedDateTime(transaction?.date)}</p>
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
                  <h2>{formatNumber(transaction?.price || 0)} Ar</h2>
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
            {transaction?.description && (
              <div className="itemdetail-description">
                <h2>Description</h2>
                <div className="itemdetail-description-content">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: convertNewline(transaction?.description || ""),
                    }}
                  />
                </div>
              </div>
            )}
            <p className="itemdetail-created">
              Created by: {transaction?.user?.username}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsDetail;
