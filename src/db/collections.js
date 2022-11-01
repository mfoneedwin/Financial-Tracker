import {
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  setDoc,
  getDoc,
  startAfter,
} from "firebase/firestore";
import moment from "moment";
import { LIMIT_DATA } from "../lib/constants";
import { getDataFromSnapshot } from "../lib/functions";
import { db } from "./firebase";

export const usersCollection = collection(db, "users");
export const categoriesCollection = collection(db, "categories");
export const billsCollection = collection(db, "bills");
export const whishlistsCollection = collection(db, "whishlists");
export const transactionsCollection = collection(db, "transactions");
export const balanceCollection = collection(db, "balance");

// !setter - special

export const initBalance = async () => {
  await setDoc(doc(db, "balance", "balancevola"), {
    price: "0",
    oldPrice: "0",
  });
};

// !getters
export const getBalanceRef = async () => {
  return await doc(db, "balance", "balancevola");
};
export const getBalance = async () => {
  const balanceRef = await getBalanceRef();
  const docSnap = await getDoc(balanceRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

export const getUserRef = async (id) => {
  return await doc(db, "users", id);
};

export const getWhishlists = async () => {
  const q = query(whishlistsCollection, orderBy("date", "asc"));
  const whishlistSnapshot = await getDocs(q);
  if (!whishlistSnapshot.empty) {
    return getDataFromSnapshot(whishlistSnapshot);
  }
  return [];
};
export const getWhishlistRef = async (id) => {
  return await doc(db, "whishlists", id);
};

export const getTransactionRef = async (id) => {
  return await doc(db, "transactions", id);
};

export const getTransactionsMonth = async () => {
  const today = new Date();
  const month = moment(today).get("month") + 1;
  let year = moment(today).get("year");

  let nextMonth = month + 1;

  if (nextMonth === 13) {
    nextMonth = 1;
    year = year + 1;
  }

  const start = new Date(`${month} 01 ${year}`);
  const end = new Date(`${nextMonth} 01 ${year}`);

  const q = query(
    transactionsCollection,
    where("date", ">", start),
    where("date", "<", end),
    orderBy("date", "desc")
  );
  const transactionSnapshot = await getDocs(q);
  if (!transactionSnapshot.empty) {
    return getDataFromSnapshot(transactionSnapshot);
  }
  return [];
};
export const getTransactionsPage = async (paginate = null) => {
  const queryConstraints = [];

  if (paginate) {
    const lastVisible = paginate.docs[paginate.docs.length - 1];
    queryConstraints.push(startAfter(lastVisible));
  }

  const q = query(
    transactionsCollection,
    orderBy("date", "desc"),
    ...queryConstraints,
    limit(LIMIT_DATA)
  );
  return await getDocs(q);
};

export const getTransactionsFiltered = async (
  order = "desc",
  category = "",
  period = "all",
  paginate = null
) => {
  const queryConstraints = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const month = moment(today).get("month") + 1;
  const lastMonth = month === 1 ? 12 : month - 1;
  let year = moment(today).get("year");

  if (category) {
    queryConstraints.push(where("category", "==", category));
  }

  if (period === "today") {
    queryConstraints.push(where("date", ">", today));
  }
  if (period === "thismonth") {
    const endDate = moment(today).clone().endOf("month").format("MM DD YYYY");

    const start = new Date(`${month} 01 ${year}`);
    const end = new Date(endDate);

    queryConstraints.push(where("date", ">", start));
    queryConstraints.push(where("date", "<", end));
  }
  if (period === "lastmonth") {
    const lastMonthDate = `${lastMonth} 01 ${year}`;
    const endDate = moment(new Date(lastMonthDate))
      .clone()
      .endOf("month")
      .format("MM DD YYYY");

    const start = new Date(lastMonthDate);
    const end = new Date(endDate);

    queryConstraints.push(where("date", ">", start));
    queryConstraints.push(where("date", "<", end));
  }

  queryConstraints.push(orderBy("date", order));

  if (paginate) {
    const lastVisible = paginate.docs[paginate.docs.length - 1];
    queryConstraints.push(startAfter(lastVisible));
  }

  const q = query(
    transactionsCollection,
    ...queryConstraints,
    limit(LIMIT_DATA)
  );
  return await getDocs(q);
};

export const getBills = async () => {
  const q = query(billsCollection, orderBy("date", "asc"));
  const billsSnapshot = await getDocs(q);
  if (!billsSnapshot.empty) {
    return getDataFromSnapshot(billsSnapshot);
  }
  return [];
};
export const getBillRef = async (id) => {
  return await doc(db, "bills", id);
};
