import { Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import FoundListPage from "./pages/user/FoundListPage";
import AddFoundItemPage from "./pages/user/AddFoundItemPage";
import ClaimItemPage from "./pages/user/ClaimItemPage";
import MyClaimsPage from "./pages/user/MyClaimsPage";

import AdminRoute from "./routes/AdminRoute";
import AdminClaimReviewPage from "./pages/admin/AdminClaimReviewPage";
import AdminManageFoundPage from "./pages/admin/AdminManageFoundPage";
import AdminAddFoundPage from "./pages/admin/AdminAddFoundPage";
import AdminExpiredItemsPage from "./pages/admin/AdminExpiredItemsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<FoundListPage />} />
        <Route path="/report-found-item" element={<AddFoundItemPage />} />
        <Route path="/claims/new/:itemId" element={<ClaimItemPage />} />
        <Route path="/my-claims" element={<MyClaimsPage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin/claims" element={<AdminClaimReviewPage />} />
        <Route path="/admin/found-items" element={<AdminManageFoundPage />} />
        <Route path="/admin/add-found-item" element={<AdminAddFoundPage />} />
        <Route path="/admin/expired-items" element={<AdminExpiredItemsPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;