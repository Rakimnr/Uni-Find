import { Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import FoundListPage from "./pages/user/FoundListPage";
import AddFoundItemPage from "./pages/user/AddFoundItemPage";
import ClaimItemPage from "./pages/user/ClaimItemPage";
import MyClaimsPage from "./pages/user/MyClaimsPage";
import UserDashboardPage from "./pages/user/UserDashboardPage";
import MyProfilePage from "./pages/user/MyProfilePage";

import AdminClaimReviewPage from "./pages/admin/AdminClaimReviewPage";
import AdminManageFoundPage from "./pages/admin/AdminManageFoundPage";
import AdminAddFoundPage from "./pages/admin/AdminAddFoundPage";
import AdminExpiredItemsPage from "./pages/admin/AdminExpiredItemsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<UserLayout />}>
        <Route path="/" element={<FoundListPage />} />
        <Route path="/found-items" element={<FoundListPage />} />

        <Route
          path="/report-found-item"
          element={
            <ProtectedRoute>
              <AddFoundItemPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/claims/new/:itemId"
          element={
            <ProtectedRoute>
              <ClaimItemPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-claims"
          element={
            <ProtectedRoute>
              <MyClaimsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<AdminLayout />}>
        <Route
          path="/admin/claims"
          element={
            <AdminRoute>
              <AdminClaimReviewPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/found-items"
          element={
            <AdminRoute>
              <AdminManageFoundPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-found-item"
          element={
            <AdminRoute>
              <AdminAddFoundPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/expired-items"
          element={
            <AdminRoute>
              <AdminExpiredItemsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfilePage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;