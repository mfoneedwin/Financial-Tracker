import { useContext, useEffect, useState } from "react";
import TransactionItem from "../components/TransactionItem";
import { ReactComponent as FilterIcon } from "../assets/icons/filter.svg";
import DataContext from "../context/DataContext";
import Loader from "../components/Loader";
import TransactionFilter from "../components/TransactionFilter";
import {
  getTransactionsFiltered,
  getTransactionsPage,
} from "../db/collections";
import { getDataFromSnapshot } from "../lib/functions";

const Transactions = () => {
  const [show, setShow] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading] = useState(false);

  const {
    hasFilter,
    filters,
    transactions,
    updateTransactions,
    snapTransaction,
    updateSnapTransaction,
  } = useContext(DataContext);

  useEffect(() => {
    const snapDocs = snapTransaction?.docs?.length || 0;

    if (snapDocs < 1) {
      setNoMoreData(true);
    } else {
      setNoMoreData(false);
    }
  }, [snapTransaction]);

  const showFilter = (e) => {
    e.preventDefault();
    if (document) {
      document.body.style.overflow = "hidden";
    }
    setShow(true);
  };

  const hideFilter = () => {
    if (document) {
      document.body.style.overflow = "scroll";
    }
    setShow(false);
  };

  const loadMoreData = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    let newSnapshot;
    if (hasFilter) {
      newSnapshot = await getTransactionsFiltered(
        filters?.order,
        filters?.category,
        filters?.period,
        snapTransaction
      );
    } else {
      newSnapshot = await getTransactionsPage(snapTransaction);
    }
    updateSnapTransaction(newSnapshot);

    if (!newSnapshot.empty) {
      const data = getDataFromSnapshot(newSnapshot);
      if (data.length > 0) {
        const newTransactions = [...transactions, ...data];
        updateTransactions(newTransactions);
        setIsFetching(false);
      } else {
        setIsFetching(false);
        setNoMoreData(true);
      }
    } else {
      setIsFetching(false);
      setNoMoreData(true);
    }
  };

  return (
    <div className="page">
      <div className="transactioncontainer">
        <div className="title">
          <h2>Transactions</h2>
          <button type="submit" onClick={showFilter}>
            <FilterIcon />
          </button>
        </div>
        {isLoading ? (
          <div className="loadingContainer">
            <Loader />
          </div>
        ) : transactions.length > 0 ? (
          <>
            {transactions.map((item) => (
              <TransactionItem
                key={item.id}
                price={item?.price}
                title={item?.title}
                date={item?.date}
                category={item?.category}
                transactionType={item?.type}
                link={`/transaction/${item.id}/view`}
                isTransaction
              />
            ))}
            {!noMoreData && (
              <div className="loadmorebtn">
                <button type="button" onClick={loadMoreData}>
                  {isFetching ? <Loader size="small" /> : "Load more"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="nodata">
            <p>No Data</p>
          </div>
        )}
      </div>

      <TransactionFilter hideFilter={hideFilter} show={show} />
    </div>
  );
};

export default Transactions;
