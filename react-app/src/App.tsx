import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./shared/componenets/Layout";
import ProductList from "./pages/product/ProductListPage";
import ProductDetails from "./pages/product/ProductDetailsPage";
import Login from "./pages/authentication/LoginPage";
import NotFound from "./shared/componenets/NotFound";
import LayoutProductDetails from "./shared/componenets/LayoutProductDetails";
import ShoppingCart from "./pages/shopping-cart/ShoppingCartPage";
import OrderPlaced from "./pages/shopping-cart/OrderPlaced";
import MyOrders from "./pages/profile/MyOrdersPage";
import { RootState } from "./redux/store";
import { useSelector } from "react-redux";
import Register from "./pages/authentication/RegisterPage";
import SignOutSuccess from "./pages/authentication/SignOutSuccess";
import AuthVerify from "./shared/componenets/AuthVerify";
import ProfileMenuNavigator from "./shared/componenets/ProfileMenuNavigator";
import ChangePassword from "./pages/authentication/ChangePasswordPage";
import ChangePasswordSuccess from "./pages/authentication/ChangePasswordSuccessPage";
import { lazy, Suspense } from "react";
import AdminAddEditProduct from "./pages/admin/AdminAddEditProductPage";
import AdminAddEditCategory from "./pages/admin/AdminAddEditCategoryPage";
import { ToastContainer } from "react-toastify";

function App() {
  const auth = useSelector((state: RootState) => state.auth);
  const AdminMainPage = lazy(() => import("./pages/admin/AdminMainPage"));

  function getAdminAddEditProductRoute(withId?: boolean) {
    return (
      <Route
        path={withId ? "/admin/addproduct/:id" : "/admin/addproduct"}
        element={
          <Suspense fallback={<div>Loading…</div>}>
            <LayoutProductDetails>
              {auth.isAuthenticated && auth.user?.userRole === "Admin" && (
                <AdminAddEditProduct />
              )}

              {(!auth.isAuthenticated ||
                (auth.isAuthenticated && auth.user?.userRole !== "Admin")) && (
                <Login />
              )}
            </LayoutProductDetails>
          </Suspense>
        }
      />
    );
  }

  function getAdminAddEditCategoryRoute(withId?: boolean) {
    return (
      <Route
        path={withId ? "/admin/addcategory/:id" : "/admin/addcategory"}
        element={
          <Suspense fallback={<div>Loading…</div>}>
            <LayoutProductDetails>
              {auth.isAuthenticated && auth.user?.userRole === "Admin" && (
                <AdminAddEditCategory />
              )}

              {(!auth.isAuthenticated ||
                (auth.isAuthenticated && auth.user?.userRole !== "Admin")) && (
                <Login />
              )}
            </LayoutProductDetails>
          </Suspense>
        }
      />
    );
  }

  return (
    <>
      <Router>
        <AuthVerify />
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <ProductList />
              </Layout>
            }
          />
          <Route
            path="/details/:id"
            element={
              <LayoutProductDetails>
                <ProductDetails />
              </LayoutProductDetails>
            }
          />
          <Route
            path="/shoppingcart"
            element={
              <LayoutProductDetails>
                <ShoppingCart />
              </LayoutProductDetails>
            }
          />
          <Route
            path="/login"
            element={
              <LayoutProductDetails>
                <Login />
              </LayoutProductDetails>
            }
          />
          <Route
            path="/login/:returnUrl"
            element={
              <LayoutProductDetails>
                <Login />
              </LayoutProductDetails>
            }
          />
          <Route
            path="/register"
            element={
              <LayoutProductDetails>
                <Register />                
              </LayoutProductDetails>
            }
          />
          <Route
            path="/changepassword"
            element={
              <LayoutProductDetails>
                <ChangePassword />
              </LayoutProductDetails>
            }
          />
          <Route
            path="/changepasswordsuccess"
            element={
              <LayoutProductDetails>
                <ChangePasswordSuccess />
              </LayoutProductDetails>
            }
          />
          <Route
            path="/signoutsuccess"
            element={
              <LayoutProductDetails>
                <SignOutSuccess />
              </LayoutProductDetails>
            }
          />
          <Route
            path="/orderplaced"
            element={
              <LayoutProductDetails>
                <OrderPlaced />
              </LayoutProductDetails>
            }
          />
          <Route
            path="/myorders"
            element={
              <LayoutProductDetails>
                {auth.isAuthenticated && <MyOrders />}

                {!auth.isAuthenticated && <Login />}
              </LayoutProductDetails>
            }
          />
          <Route
            path="/profilemenunavigator"
            element={
              <LayoutProductDetails>
                <ProfileMenuNavigator />
              </LayoutProductDetails>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div>Loading…</div>}>
                <LayoutProductDetails>
                  {auth.isAuthenticated && auth.user?.userRole === "Admin" && (
                    <AdminMainPage />
                  )}

                  {(!auth.isAuthenticated ||
                    (auth.isAuthenticated &&
                      auth.user?.userRole !== "Admin")) && (
                    <Login adminPageLogin={true} />
                  )}
                </LayoutProductDetails>
              </Suspense>
            }
          />
          {getAdminAddEditProductRoute(true)}
          {getAdminAddEditProductRoute()}
          {getAdminAddEditCategoryRoute(true)}
          {getAdminAddEditCategoryRoute()}
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
