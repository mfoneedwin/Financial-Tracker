import { Suspense, lazy, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout/Layout";
import Home from "./pages/Home";
import PassCode from "./pages/PassCode/PassCode";
import FallBack from "./components/FallBack";
import AuthContext from "./context/AuthContext";
import DataContext from "./context/DataContext";

const Bills = lazy(() => import("./pages/Bills"));
const BillsDetail = lazy(() => import("./pages/BillsDetail"));
const BillsManage = lazy(() => import("./pages/BillsManage"));
const Whishlist = lazy(() => import("./pages/Whishlist"));
const WhishlistDetail = lazy(() => import("./pages/WhishlistDetail"));
const WhishlistManage = lazy(() => import("./pages/WhishlistManage"));
const Transactions = lazy(() => import("./pages/Transactions"));
const TransactionsDetail = lazy(() => import("./pages/TransactionsDetail"));
const TransactionsManage = lazy(() => import("./pages/TransactionsManage"));
const User = lazy(() => import("./pages/User"));

const App = () => {
  const { isConnected, disconnect } = useContext(AuthContext);
  const { appLoading } = useContext(DataContext);

  useEffect(() => {
    return () => {
      // disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return appLoading ? (
    <FallBack />
  ) : isConnected ? (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="bill"
            element={
              <Suspense fallback={<FallBack />}>
                <Bills />
              </Suspense>
            }
          />
          <Route
            path="bill/:id"
            element={
              <Suspense fallback={<FallBack />}>
                <BillsManage />
              </Suspense>
            }
          />
          <Route
            path="bill/:id/view"
            element={
              <Suspense fallback={<FallBack />}>
                <BillsDetail />
              </Suspense>
            }
          />
          <Route
            path="whishlist"
            element={
              <Suspense fallback={<FallBack />}>
                <Whishlist />
              </Suspense>
            }
          />
          <Route
            path="whishlist/:id"
            element={
              <Suspense fallback={<FallBack />}>
                <WhishlistManage />
              </Suspense>
            }
          />
          <Route
            path="whishlist/:id/view"
            element={
              <Suspense fallback={<FallBack />}>
                <WhishlistDetail />
              </Suspense>
            }
          />
          <Route
            path="transaction"
            element={
              <Suspense fallback={<FallBack />}>
                <Transactions />
              </Suspense>
            }
          />
          <Route
            path="transaction/:id/view"
            element={
              <Suspense fallback={<FallBack />}>
                <TransactionsDetail />
              </Suspense>
            }
          />
          <Route
            path="transaction/:id"
            element={
              <Suspense fallback={<FallBack />}>
                <TransactionsManage />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<FallBack />}>
                <User />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  ) : (
    <PassCode />
  );
};

export default App;
