const redirectPath = sessionStorage.getItem("redirectPath");
if (redirectPath && window.location.search.includes("redirect=true")) {
  sessionStorage.removeItem("redirectPath");
  window.history.replaceState(null, "", redirectPath);
}



import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter, } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import NotFound from './notFound';
import './index.css';

// Layouts
import Admin from './views/admin/AdminLayouts';
import AgentBrokerLayout from './views/agent/AgentBrokerLayout';
import Brokerlayout from './views/broker/BrokerLayout';

// Components
import Loader from './components/loader';
import LoaderCard from './components/loaderCard';
import ProtectedRoute from './sanctum/ProtectedRoute';
import PublicRoute from './sanctum/PublicRoute';

// Lazy-loaded components
const Login = lazy(() => wait(3000).then(() => import("./views/auth/login/Login")));
const Register = lazy(() => wait(3000).then(() => import("./views/auth/register/Register")));
const ForgotPassword = lazy(() => wait(3000).then(() => import("./views/auth/forgotPassword")));
const ResetPassword = lazy(() => wait(3000).then(() => import("./views/auth/resetPassword")));
const DashboardContainer = lazy(() => wait(3000).then(() => import("./views/admin/dashboard/DashboardContainer")));
const AdminProfile = lazy(() => wait(3000).then(() => import("./views/admin/profile/EditProfile")));
const DeveloperContainer = lazy(() => wait(3000).then(() => import("./views/admin/developer/DeveloperContainer")));
const Facilainers = lazy(() => wait(3000).then(() => import("./views/admin/affialiated/AffialiatedContainer")));
const ListOfBrokerAgent = lazy(() => wait(3000).then(() => import("./views/admin/affialiated/table/ListOfBrokerAgent")));
const ListOfPendingRegistered = lazy(() => wait(3000).then(() => import("./views/admin/affialiated/table/ListOfPendingRegistered")));
const ListOfLiscenced = lazy(() => wait(3000).then(() => import("./views/admin/affialiated/table/ListOfLiscenced")));
const ListOfUnliscenced = lazy(() => wait(3000).then(() => import("./views/admin/affialiated/table/ListOfUnliscenced")));
const SalesEncodingContainer = lazy(() => wait(3000).then(() => import("./views/admin/salesEncoding/SalesEncodingContainer")));
const BrokerageProperty = lazy(() => wait(3000).then(() => import("./views/admin/brokerage/BrokerageProperty")));
const SalesReport = lazy(() => wait(3000).then(() => import("./views/admin/reports/SalesReport")));
const DashboardAgentBroker = lazy(() => wait(3000).then(() => import("./views/agent/dashboard/DashboardContainer")));
const AgentProfile = lazy(() => wait(3000).then(() => import("./views/agent/profile/EditProfile")));
const SalesAgentEncoding = lazy(() => wait(3000).then(() => import("./views/agent/salesEncoding/SalesAgentEncoding")));
const AgentBrokerage = lazy(() => wait(3000).then(() => import("./views/agent/brokerage/AgentBrokerage")));
const Reports = lazy(() => wait(3000).then(() => import("./views/agent/reports/Reports")));
const DashboardBroker = lazy(() => wait(3000).then(() => import("./views/broker/dashboard/DashboardBroker")));
const BrokerProfile = lazy(() => wait(3000).then(() => import("./views/broker/profile/EditProfile")));
const SalesBrokerEncoding = lazy(() => wait(3000).then(() => import("./views/broker/salesEncoding/SalesBrokerEncoding")));
const Brokerage = lazy(() => wait(3000).then(() => import("./views/broker/brokerage/Brokerage")));
const ReportBroker = lazy(() => wait(3000).then(() => import("./views/broker/reports/Reports")));

// Route configuration
const routes = [
  {
    path: "/",
    element: <Navigate to="/user-login" />,
  },
  {
    path: "/user-login",
    element: (
      <Suspense fallback={<Loader />}>
        <PublicRoute>
          <Login />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/user-register",
    element: (
      <Suspense fallback={<Loader />}>
        <PublicRoute>
          <Register />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={<Loader />}>
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <Suspense fallback={<Loader />}>
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: <ProtectedRoute element={<Admin />} allowedRoles={['0']} />,
    children: [
      { path: "", element: <Navigate to="/admin/user-dashboard" /> },
      { path: "user-dashboard", element: <Suspense fallback={<Loader />}><DashboardContainer /></Suspense> },
      { path: "admin-profile", element: <Suspense fallback={<Loader />}><AdminProfile /></Suspense> },
      { path: "developer", element: <Suspense fallback={<Loader />}><DeveloperContainer /></Suspense> },
      {
        path: "affialiated",
        element: <Suspense fallback={<Loader />}><Facilainers /></Suspense>,
        children: [
          { path: "", element: <ListOfBrokerAgent /> },
          { path: "pendingRegister", element: <Suspense fallback={<LoaderCard />}><ListOfPendingRegistered /></Suspense> },
          { path: "licensed", element: <Suspense fallback={<LoaderCard />}><ListOfLiscenced /></Suspense> },
          { path: "unlicensed", element: <Suspense fallback={<LoaderCard />}><ListOfUnliscenced /></Suspense> },
        ],
      },
      { path: "sales-encoding", element: <Suspense fallback={<Loader />}><SalesEncodingContainer /></Suspense> },
      { path: "brokerage-property", element: <Suspense fallback={<Loader />}><BrokerageProperty /></Suspense> },
      { path: "sales-report", element: <Suspense fallback={<Loader />}><SalesReport /></Suspense> },
    ],
  },
  {
    path: "/agent-broker",
    element: <ProtectedRoute element={<AgentBrokerLayout />} allowedRoles={['1']} />,
    children: [
      { path: "", element: <Navigate to="/agent-broker/user-dashboard" /> },
      { path: "user-dashboard", element: <Suspense fallback={<Loader />}><DashboardAgentBroker /></Suspense> },
      { path: "agent-profile", element: <Suspense fallback={<Loader />}><AgentProfile /></Suspense> },
      { path: "agent-salesEncoding", element: <Suspense fallback={<Loader />}><SalesAgentEncoding /></Suspense> },
      { path: "agent-brokerage", element: <Suspense fallback={<Loader />}><AgentBrokerage /></Suspense> },
      { path: "agent-salesReport", element: <Suspense fallback={<Loader />}><Reports /></Suspense> },
    ],
  },
  {
    path: "/broker",
    element: <ProtectedRoute element={<Brokerlayout />} allowedRoles={['2', '0']} />,
    children: [
      { path: "", element: <Navigate to="/broker/broker-dashboard" /> },
      { path: "broker-dashboard", element: <Suspense fallback={<Loader />}><DashboardBroker /></Suspense> },
      { path: "broker-profile", element: <Suspense fallback={<Loader />}><BrokerProfile /></Suspense> },
      { path: "broker-salesEncoding", element: <Suspense fallback={<Loader />}><SalesBrokerEncoding /></Suspense> },
      { path: "broker-brokerage", element: <Suspense fallback={<Loader />}><Brokerage /></Suspense> },
      { path: "broker-salesReport", element: <Suspense fallback={<Loader />}><ReportBroker /></Suspense> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

const router = createBrowserRouter(routes);

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);