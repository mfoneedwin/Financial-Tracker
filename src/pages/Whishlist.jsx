import { useState, useEffect, useContext } from "react";
import BigCard from "../components/BigCard";
import TransactionItem from "../components/TransactionItem";
import { ReactComponent as AddIcon } from "../assets/icons/add.svg";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { getWhishlists } from "../db/collections";
import DataContext from "../context/DataContext";

const Whishlist = () => {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { whishlists, updateWhishlists } = useContext(DataContext);

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

      const data = await getWhishlists();
      if (data.length > 0) {
        updateWhishlists(data);
        calculateTotal(data);
      }
      setIsLoading(false);
    };

    if (whishlists.length === 0) fetchData();
    else {
      calculateTotal(whishlists);
    }
  }, [whishlists, updateWhishlists]);

  return (
    <div className="page">
      <div className="subpage hasunder green cardcontainer">
        <div className="homecard">
          <BigCard title="Total whishlist" price={total} color="green" />
        </div>
        <div className="addlinkbtn">
          <Link to="/whishlist/add">
            <AddIcon />
            <span>Add whishlist</span>
          </Link>
        </div>
      </div>
      <div className="subpage under gray billscontainer">
        <div className="title">
          <h2>Whishlist</h2>
        </div>
        {isLoading ? (
          <div className="loadingContainer">
            <Loader />
          </div>
        ) : whishlists.length > 0 ? (
          whishlists.map((item) => (
            <TransactionItem
              key={item.id}
              price={item?.price}
              title={item?.title}
              category={item?.category}
              date={item?.date}
              link={`/whishlist/${item.id}/view`}
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

export default Whishlist;
