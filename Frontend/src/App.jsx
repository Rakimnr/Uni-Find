import { Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import FoundListPage from "./pages/user/FoundListPage";
import AddFoundItemPage from "./pages/user/AddFoundItemPage";
import ClaimItemPage from "./pages/user/ClaimItemPage";
import MyClaimsPage from "./pages/user/MyClaimsPage";

import AdminClaimReviewPage from "./pages/admin/AdminClaimReviewPage";

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
        <Route path="/admin" element={<AdminClaimReviewPage />} />
        <Route path="/admin/claims" element={<AdminClaimReviewPage />} />
      </Route>
    </Routes>
  );
}

export default App;