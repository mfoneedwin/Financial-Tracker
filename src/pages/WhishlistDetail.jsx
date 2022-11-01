import { deleteDoc, getDoc } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import DataContext from "../context/DataContext";
import { getWhishlistRef } from "../db/collections";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow.svg";
import { ReactComponent as TrashIcon } from "../assets/icons/trash.svg";
import {
  formatNumber,
  getFormatedDateTime,
  convertNewline,
} from "../lib/functions";

const WhishlistDetail = () => {
  const [whishlist, setWhishlist] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { whishlists, updateWhishlists, categories } = useContext(DataContext);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const whishlistRef = await getWhishlistRef(id);
      const whishlistSnapshot = await getDoc(whishlistRef);

      if (whishlistSnapshot?.exists()) {
        const data = whishlistSnapshot?.data();
        const refData = whishlistSnapshot?.id;
        const whsl = { ...data, id: refData };
        setWhishlist(whsl);
        setIsLoading(false);
      } else {
        navigate("/whishlist");
      }
    };

    if (whishlists.length > 0) {
      const currentWhishlist = whishlists.find((whl) => whl.id === id);
      if (currentWhishlist) setWhishlist(currentWhishlist);
      else navigate("/whishlist");
    } else {
      fetchData();
    }
  }, [id, whishlists, navigate]);

  const addTransaction = (e) => {
    e.preventDefault();
    const dataTransaction = {
      type: "out",
      title: whishlist?.title || "",
      price: whishlist?.price || "",
      category: whishlist?.category || "",
      description: whishlist?.description || "",
      whishlist: id || "",
    };

    navigate("/transaction/add", { state: dataTransaction });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const currentWhishlistRef = await getWhishlistRef(id);
      await deleteDoc(currentWhishlistRef);

      const newWishlist = whishlists.filter((whs) => whs.id !== id);
      updateWhishlists(newWishlist);
      navigate("/whishlist");
    } catch (e) {
      setIsDeleting(false);
      alert("An error occured!");
      console.error("Error adding document: ", e);
    }
  };

  const category = categories.find((cate) => cate.id === whishlist?.category);

  return (
    <div className="page">
      <div className="subpage hasunder green cardcontainer detailheader">
        <div className="detailheader-top">
          <div className="detailheader-top-back">
            <Link to={`/whishlist`}>
              <ArrowIcon />
            </Link>
          </div>
          <div className="detailheader-top-edit">
            <Link to={`/whishlist/${id}`}>Edit</Link>
          </div>
        </div>
        <h2>{whishlist?.title}</h2>
        <p>{getFormatedDateTime(whishlist?.date)}</p>
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
                  <h2>{formatNumber(whishlist?.price || 0)} Ar</h2>
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
            {whishlist?.description && (
              <div className="itemdetail-description">
                <h2>Description</h2>
                <div className="itemdetail-description-content">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: convertNewline(whishlist?.description || ""),
                    }}
                  />
                </div>
              </div>
            )}
            <p className="itemdetail-created">
              Created by: {whishlist?.user?.username}
            </p>
            <button
              onClick={addTransaction}
              type="button"
              className="itemdetail-buy"
            >
              Get Item
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

export default WhishlistDetail;
