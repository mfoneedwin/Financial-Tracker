import { useState, useEffect, useContext } from "react";
import BigCard from "../components/BigCard";
import TransactionItem from "../components/TransactionItem";
import { ReactComponent as AddIcon } from "../assets/icons/add.svg";
import { Link } from "react-router-dom";
import DataContext from "../context/DataContext";
import { getBills } from "../db/collections";
import Loader from "../components/Loader";

const Bills = () => {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { bills, updateBills } = useContext(DataContext);

  useEffect(() => {
    const calculateTotal = (list) => {
      const tot = list.reduce(
        (prev, curr) => prev + parseInt(curr.price, 10),
        0
      );
      setTotal(tot);
    };

    const fetchData = async () => {
      setIsLoading(true);

      const data = await getBills();
      if (data.length > 0) {
        updateBills(data);
        calculateTotal(data);
      }
      setIsLoading(false);
    };

    if (bills.length === 0) fetchData();
    else {
      calculateTotal(bills);
    }
  }, [bills, updateBills]);

  return (
    <div className="page">
      <div className="subpage hasunder green cardcontainer">
        <div className="homecard">
          <BigCard title="Monthly bills" price={total} color="black" />
        </div>
        <div className="addlinkbtn">
          <Link to="/bill/add">
            <AddIcon />
            <span>Add bill</span>
          </Link>
        </div>
      </div>
      <div className="subpage under gray billscontainer">
        <div className="title">
          <h2>Bills</h2>
        </div>
        {isLoading ? (
          <div className="loadingContainer">
            <Loader />
          </div>
        ) : bills.length > 0 ? (
          bills.map((item) => (
            <TransactionItem
              key={item.id}
              price={item?.price}
              title={item?.title}
              category={item?.category}
              paydate={item?.paydate}
              link={`/bill/${item.id}/view`}
              usePayday
            />
          ))
        ) : (
          <div className="nodata">
            <p>No Data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bills;
