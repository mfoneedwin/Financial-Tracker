import moment from "moment";
import { useContext } from "react";
import DataContext from "../context/DataContext";
import { formatNumber } from "../lib/functions";
import BigCard from "./BigCard";
import MiniCard from "./MiniCard";

const HomeCards = ({ month = "" }) => {
  const { homeTransactions, balance } = useContext(DataContext);

  const incomes = homeTransactions.filter((tra) => tra.type === "in");
  const expenses = homeTransactions.filter((tra) => tra.type === "out");
  const todaysTransactions = homeTransactions.filter(
    (tran) =>
      tran.type === "out" &&
      moment(new Date()).isSame(moment(tran.date.toDate()), "day")
  );

  const totalIncome = incomes.reduce(
    (prev, curr) => prev + parseInt(curr.price, 10),
    0
  );

  const totalExpense = expenses.reduce(
    (prev, curr) => prev + parseInt(curr.price, 10),
    0
  );
  const totalTodayTransaction = todaysTransactions.reduce(
    (prev, curr) => prev + parseInt(curr.price, 10),
    0
  );

  return (
    <div className="homecard">
      <BigCard
        title="Available balance"
        price={balance?.price || 0}
        link="/transaction"
      />
      <div className="homecard-small bulbles">
        <p>{month} Cashflow</p>
        <div className="homecard-small-container">
          <MiniCard title="Income" price={totalIncome || 0} />
          <div className="homecard-small-separation" />
          <MiniCard
            effect="mirror"
            title="Expense"
            price={totalExpense || 0}
            direction="up"
          />
        </div>
      </div>
      <div className="homecard-small blue">
        <p>Today's Spending</p>
        <h2>{formatNumber(totalTodayTransaction || 0)} Ar</h2>
      </div>
    </div>
  );
};

export default HomeCards;
