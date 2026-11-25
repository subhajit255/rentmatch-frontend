import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import Landing from "./ContentMangementSystem/screens/Landing/Landing";
import About from "./ContentMangementSystem/screens/Landing/About";
import FindProperty from "./ContentMangementSystem/screens/Landing/FindProperty";
import FindTenant from "./ContentMangementSystem/screens/Landing/FindTenant";
import Login from "./Auth/Login";
import "tailwindcss";
import EmailVerification from "./Auth/EmailVerification";
import Registration from "./Auth/Registration";
import Dashboard from "./Tenent/Dashboard";
import ExploreProperties from "./Tenent/ExploreProperties";
import MyPost from "./Tenent/Post/MyPost";
import CreatePost from "./Tenent/Post/CreatePost";
import PostDetails from "./Tenent/Post/PostDetails";
import Layout from "./Layout";
import CMSLayout from "./CMSLayout";
import AuthLayout from "./AuthLayout";
import ProtectedRoute from "./wrappers/protectedRoute";
import UnProtectedRoute from "./wrappers/unprotectedRoutes";
import PropertyTypeAdminIndexPage from "./admin/propertyType";
import PropertyTypeForm from "./admin/propertyType/form";
import SubscriptionList from "./admin/plans";
import FindRentalAgent from "./ContentMangementSystem/screens/Landing/FindRentalAgent";
import { ProtectedRouteProps } from "../types/memberTypes";
import RentalAgentDetails from "./ContentMangementSystem/screens/Landing/sections/RentalAgentDetails/RentalAgentDetails";
import SubscriptionAnalytics from "./admin/plans/analytics";
import SubscriptionForm from "./admin/plans/form";
import PropertyAddForm from "./landlord/property/addProperty";
import ComingSoon from "./ChildComponent/Common/ComingSoon";
// import c from './admin/PropertyTypeForm';
import MyProperty from "./landlord/property/myProperty";
import SaveProperty from "./Property/SaveProperty";
import AllSubscriptionLists from "./admin/plans/allSubsScription";
import AdminList from "./admin/adminList.tsx";
import MemberList from "./admin/memberList.tsx";
import FindTenants from "./findTanent";
import TenantPostDetails from "./post/TenantPostDetails";
import Faqs from "./Faqs/Faqs";
import Policy from "./Policy/Policy";
import HelpCenter from "./HelpCenter/HelpCenter";
import PaymentWrapper from "./checkouts/paymentWrapper";
import SubscriptionListForOwners from "./checkouts/subscriptionListForOwners";
import PaymentSuccess from "./checkouts/PaymentSuccess";
import MessagePage from "./chats/messagePage";
import SchedulesComponent from "./schedules/List";
import PaymentLayout from "./checkouts/paymentLayout";
import FaqsAdminIndexPage from "./admin/faq";
import FaqsAdminForm from "./admin/faq/form";
import TermsConditionsAndPrivacyPolicyAdminIndexPage from "./admin/termsConditionsAndPrivacyPolicy";
import TermsConditionsAndPrivacyPolicyAdminForm from "./admin/termsConditionsAndPrivacyPolicy/form";
// import { SocketProvider } from "../context/SocketContext";
const ProfileDetails = React.lazy(() => import("./admin/profile/profileDetails"));
import EditProfile from "./admin/profile/editMyProfile";
const SavedTenentPost = React.lazy(() => import("./findTanent/savedPost"));
import AddAdmin from "./admin/create";
import MemberDetails from "./admin/memberList.tsx/details";
import SettingsPage from "./AllUserSettings/settingPage";
import RolePermissionComponent from "./admin/rolePermission/rolePermissionComponent";
import NotificationPage from "./notification/notificationPage";
import RoleForm from "./admin/rolePermission/rolepermissionForm";
import AdminSupportPanel from "./HelpCenter/feedbackSupport";
import ConnectusList from "./HelpCenter/connectusList";
import FeedbackListAdmin from "./feedback-admin-tenent/feedbackListAdmin";
import HowItWorks from "./ContentMangementSystem/screens/Landing/HowItWorks";
import Advice from "./ContentMangementSystem/screens/Landing/Advice";
const FeaturedProperty = React.lazy(() => import("./featuredProperty/featuredProperty"));
import PropertyMatchDetails from "./Property/PropertyMatchDetails";

const App: React.FC = () => {

  function AuthenticatedLayout() {
    return (
      // <SocketProvider>
      <Outlet />
      // </SocketProvider>
    );
  }
  return (
    // <ThemeProvider theme={theme}>
    // <Router>
    <Routes>
      <Route element={<UnProtectedRoute />}>
        {/* Public Routes */}
        <Route element={<CMSLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/find-property" element={<FindProperty />} />
          <Route path="/find-tenant" element={<FindTenant />} />
          <Route path="/advice" element={<Advice />} />
          {/* <Route path="/find-rental-agent" element={<FindRentalAgent />} /> */}
          <Route
            path="/rental-agent-details"
            element={<RentalAgentDetails />}
          />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/super-admin/login" element={<Login />} />
          <Route
            path="/email-verification/:page?"
            element={<EmailVerification />}
          />
          <Route path="/registration" element={<Registration />} />
        </Route>
      </Route>

      {/* Subscription & Payment Checkout Routes (accessible by logged-in and onboarding owners) */}
      <Route element={<AuthLayout />}>
        <Route element={<PaymentLayout />}>
          <Route
            path="/subscriptions"
            element={<SubscriptionListForOwners />}
          />
          <Route path="/checkout" element={<PaymentWrapper />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Route>
      </Route>

      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          {/* <Route element={<Layout />} > */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<AuthenticatedLayout />}>
            <Route path="/message" element={<MessagePage />} />
            <Route path="/profile" element={<ProfileDetails />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Route>
          <Route path="/faq" element={<MessagePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="*" element={<ComingSoon />} />
          {/* </Route> */}
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["SUPER ADMIN", "ADMIN"] as ProtectedRouteProps[]}
            />
          }
        >
          {/* <Route element={<Layout />} > */}
          {/* Admin Routes */}
          <Route
            path="/role-permission"
            element={<RolePermissionComponent />}
          />
          <Route path="/featured-properties" element={<FeaturedProperty />} />

          <Route
            path="/feedback-and-support"
            element={<AdminSupportPanel />}
          />

          <Route
            path="/feedback-list"
            element={<FeedbackListAdmin />}
          />
          <Route
            path="/connect-us-admin"
            element={<ConnectusList />}
          />
          <Route
            path="/role-permission/edit/:id"
            element={<RoleForm />}
          />
          <Route
            path="/property-type"
            element={<PropertyTypeAdminIndexPage />}
          />
          <Route
            path="/property-type/create"
            element={<PropertyTypeForm />}
          />
          <Route path="/property-type/edit" element={<PropertyTypeForm />} />
          <Route
            path="/subscription/plans/:tab?"
            element={<SubscriptionList isAdmin={true} />}
          />
          <Route
            path="/data-and-analytics"
            element={<SubscriptionAnalytics />}
          />

          <Route
            path="/subscription/plans/create"
            element={<SubscriptionForm />}
          />
          <Route
            path="/subscription/plans/edit"
            element={<SubscriptionForm />}
          />
          <Route
            path="/all-subscriptions"
            element={<AllSubscriptionLists />}
          />

          <Route path="/faq-management" element={<FaqsAdminIndexPage />} />
          <Route path="/faq/create" element={<FaqsAdminForm />} />
          <Route path="/faq/edit" element={<FaqsAdminForm />} />

          {/* Privacy Policy */}
          <Route
            path="/privacy-policy"
            element={
              <TermsConditionsAndPrivacyPolicyAdminIndexPage type="PRIVACY_POLICY" />
            }
          />
          <Route
            path="/privacy-policy/create"
            element={<TermsConditionsAndPrivacyPolicyAdminForm />}
          />
          <Route
            path="/privacy-policy/edit"
            element={<TermsConditionsAndPrivacyPolicyAdminForm />}
          />

          {/* terms-and-conditions */}
          <Route
            path="/terms-and-conditions"
            element={
              <TermsConditionsAndPrivacyPolicyAdminIndexPage type="TERMS_AND_CONDITIONS" />
            }
          />
          <Route
            path="/terms-and-conditions/create"
            element={<TermsConditionsAndPrivacyPolicyAdminForm />}
          />

          <Route
            path="/terms-and-conditions/edit"
            element={<TermsConditionsAndPrivacyPolicyAdminForm />}
          />

          <Route path="/admin/:curRole?" element={<AdminList />} />
          <Route path="/add-admin/:curRole?/:_id?" element={<AddAdmin />} />
          <Route path="/member/:curRole?" element={<MemberList />} />
          <Route path="/member-detail/:_id?/:section?" element={<MemberDetails />} />
          <Route path="*" element={<ComingSoon />} />
          {/* <Route path="/plans" element={<PostDetails />} /> */}
          {/* </Route> */}
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["TENANT"] as ProtectedRouteProps[]}
            />
          }
        >
          <Route path="/my-posts" element={<MyPost />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post" element={<CreatePost />} />
          <Route path="/post-details/:id?" element={<PostDetails />} />
          {/* <Route
            path="/feedback-list-tanent"
            element={<FeedbackListAdmin />}
          /> */}
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={
                ["LANDLORD", "PROPERTY MANAGER"] as ProtectedRouteProps[]
              }
            />
          }
        >
          {/* <Route element={<Layout />} > */}
          <Route path="/property/create" element={<PropertyAddForm />} />
          <Route path="/property/edit" element={<PropertyAddForm />} />
          <Route path="/my-properties" element={<MyProperty />} />
          <Route path="/saved-posts" element={<SavedTenentPost />} />
          <Route
            path="/pricing-and-plans"
            element={<SubscriptionListForOwners />}
          />
          <Route path="*" element={<ComingSoon />} />
          {/* </Route> */}
        </Route>
        <Route
          element={
            <ProtectedRoute
              allowedRoles={
                [
                  "LANDLORD",
                  "PROPERTY MANAGER",
                  "TENANT",
                ] as ProtectedRouteProps[]
              }
            />
          }
        >
          <Route path="/saved-properties" element={<SaveProperty />} />
          <Route path="schedule-visit" element={<SchedulesComponent />} />
        </Route>
        <Route
          element={
            <ProtectedRoute
              allowedRoles={
                [
                  "LANDLORD",
                  "PROPERTY MANAGER",
                  "TENANT",
                  "GUEST",
                ] as ProtectedRouteProps[]
              }
            />
          }
        >
          <Route path="/explore-properties" element={<ExploreProperties />} />
          <Route path="/property-match/:id" element={<PropertyMatchDetails />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/policy/terms-and-conditions" element={<Policy />} />
          <Route path="/policy/privacy-policy" element={<Policy />} />
          <Route path="/help-center" element={<HelpCenter />} />
        </Route>
        <Route
          element={
            <ProtectedRoute
              allowedRoles={
                [
                  "LANDLORD",
                  "PROPERTY MANAGER",
                  "GUEST",
                ] as ProtectedRouteProps[]
              }
            />
          }
        >
          <Route path="/find-tenants" element={<FindTenants />} />
          <Route
            path="/tenant-post-details/:id?"
            element={<TenantPostDetails />}
          />
        </Route>
      </Route>
    </Routes>
    // </Router>
    // {/* </ThemeProvider> */}
  );
};

export default App;
