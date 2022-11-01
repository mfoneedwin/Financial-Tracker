import { ReactComponent as HomeIcon } from "../assets/icons/home.svg";
import { ReactComponent as BillsIcon } from "../assets/icons/bills.svg";
import { ReactComponent as UserIcon } from "../assets/icons/user.svg";
import { ReactComponent as TransactionsIcon } from "../assets/icons/transactions.svg";

const pages = [
  {
    id: 1,
    title: "Home",
    path: "/",
    icon: <HomeIcon />,
  },
  {
    id: 2,
    title: "Bills",
    path: "/bill",
    icon: <BillsIcon />,
  },
  {
    id: 3,
    title: "Transactions",
    path: "/transaction",
    icon: <TransactionsIcon />,
  },
  {
    id: 4,
    title: "Whishlist",
    path: "/whishlist",
    icon: <UserIcon />,
  },
];

export default pages;
