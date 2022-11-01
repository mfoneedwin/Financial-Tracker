import { useState, useEffect, useContext } from "react";
import { ReactComponent as AddIcon } from "../assets/icons/add.svg";
import DataContext from "../context/DataContext";
import { getTransactionsFiltered } from "../db/collections";
import { getDataFromSnapshot } from "../lib/functions";
import FormItem from "./FormItem";
import Loader from "./Loader";

const defaultFormShape = [
  {
    id: 1,
    name: "order",
    label: "Order",
    input: "order",
    required: false,
    onSelect: () => {},
  },
  {
    id: 2,
    name: "category",
    label: "Category",
    input: "category",
    required: false,
    canAdd: false,
  },
  {
    id: 3,
    name: "period",
    label: "Period",
    input: "select",
    required: false,
    items: [
      {
        id: 1,
        label: "All",
        value: "all",
      },
      {
        id: 2,
        label: "Today",
        value: "today",
      },
      {
        id: 3,
        label: "This Month",
        value: "thismonth",
      },
      {
        id: 4,
        label: "Last Month",
        value: "lastmonth",
      },
    ],
  },
];

const defaultData = {
  category: "",
  order: "desc",
  period: "all",
};

const TransactionFilter = ({ show = false, hideFilter = () => {} }) => {
  const [formData, setFormData] = useState(defaultData);
  const [formShape, setFormShape] = useState(defaultFormShape);
  const [isFetching, setIsFetching] = useState(false);

  const {
    updateTransactions,
    updateSnapTransaction,
    updateHasFilter,
    updateFilters,
    filters,
  } = useContext(DataContext);

  useEffect(() => {
    const newFormShape = defaultFormShape.map((shape) => {
      if (shape.input === "order") {
        return { ...shape, onSelect: handleSelect };
      }
      return shape;
    });

    setFormShape(newFormShape);
    if (filters) setFormData(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    const newSnapshot = await getTransactionsFiltered(
      formData.order,
      formData.category,
      formData.period
    );

    updateSnapTransaction(newSnapshot);
    const data = getDataFromSnapshot(newSnapshot);
    updateTransactions(data);
    updateFilters(formData);
    updateHasFilter(true);
    setIsFetching(false);

    hideFilter();
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((oldData) => ({ ...oldData, [name]: value }));
  };

  const handleSelect = (order) => {
    setFormData((oldData) => ({ ...oldData, order }));
  };
  return (
    <>
      {show && (
        <div className="transactionfilteroverlay" onClick={hideFilter} />
      )}
      <div className={`transactionfilter ${show ? "" : "hidden"}`}>
        <div className="transactionfilter-header">
          <button type="submit" onClick={hideFilter}>
            <AddIcon />
          </button>
          <h3>Filters</h3>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {formShape.map((form) => (
            <FormItem
              key={form.id}
              data={form}
              formData={formData}
              onChange={handleChange}
            />
          ))}
          <button type="submit" disabled={isFetching} className="form-submit">
            {isFetching ? <Loader size="small" /> : "FILTER"}
          </button>
        </form>
      </div>
    </>
  );
};

export default TransactionFilter;
