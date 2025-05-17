import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import NotFound from './notFound';
import './index.css';
import Admin from './views/admin/AdminLayouts';
import AgentBrokerLayout from './views/agent/AgentBrokerLayout';
import Loader from './components/loader';
import ListOfBrokerAgent from './views/admin/affialiated/table/ListOfBrokerAgent';
import LoaderCard from './components/loaderCard'
import ProtectedRoute from './sanctum/ProtectedRoute';
import PublicRoute from './sanctum/PublicRoute';


const Login = lazy(() =>
  wait(3000).then(() => import("./views/auth/login/Login"))
);

const Register = lazy(() =>
  wait(3000).then(() => import("./views/auth/register/Register"))
);

const ForgotPassword = lazy(() =>
  wait(3000).then(() => import("./views/auth/forgotPassword"))
);

const DashboardContainer = lazy(() =>
  wait(3000).then(() => import("./views/admin/dashboard/DashboardContainer"))
);

const Facilainers = lazy(() =>
  wait(3000).then(() => import("./views/admin/affialiated/AffialiatedContainer"))
);

const ListOfPendingRegistered = lazy(() =>
  wait(3000).then(() => import("./views/admin/affialiated/table/ListOfPendingRegistered"))
);

const ListOfLiscenced = lazy(() =>
  wait(3000).then(() => import("./views/admin/affialiated/table/ListOfLiscenced"))
);

const ListOfUnliscenced = lazy(() =>
  wait(3000).then(() => import("./views/admin/affialiated/table/ListOfUnliscenced"))
);

const DeveloperContainer = lazy(() =>
  wait(3000).then(() => import("./views/admin/developer/DeveloperContainer"))
);

const BrokerageProperty = lazy(() =>
  wait(3000).then(() => import("./views/admin/brokerage/BrokerageProperty"))
);

const SalesEncodingContainer = lazy(() =>
  wait(3000).then(() => import("./views/admin/salesEncoding/SalesEncodingContainer"))
);

const SalesReport = lazy(() =>
  wait(3000).then(() => import("./views/admin/reports/SalesReport"))
);


// Agent-Broker

const DashboardAgentBroker = lazy(() =>
  wait(3000).then(() => import("./views/agent/dashboard/DashboardContainer"))
);


// Route configuration
const routes = [
  {
    path: "/athomes",
    element: <Navigate to="/athomes/user-login" />,
  },
  {
    path: "/athomes/user-login",
    element: (
        <Suspense fallback={<Loader />}>
          <PublicRoute>
            <Login />
          </PublicRoute>
        </Suspense>
    ),
  },
  {
    path: "/athomes/user-register",
    element: (
        <Suspense fallback={<Loader />}>
          <PublicRoute>
            <Register />
          </PublicRoute>
         
        </Suspense>
    ),
  },
  {
    path: "/athomes/forgot-password",
    element: (
        <Suspense fallback={<Loader />}>
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        </Suspense>
    ),
  },
  {
    path: "/athomes/admin",
    element: (
        <ProtectedRoute element={<Admin />} allowedRoles={['0']}/>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/athomes/admin/user-dashboard" />,
      },
      {
        path: "user-dashboard",
        element: (
          <Suspense fallback={<Loader />}>
            <DashboardContainer />
          </Suspense>
        ),
      },
      {
        path: "developer",
        element: (
          <Suspense fallback={<Loader />}>
            <DeveloperContainer />
          </Suspense>
        ),
      },
      {
        path: "affialiated",
        element: (
          <Suspense fallback={<Loader />}>
            <Facilainers />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: <ListOfBrokerAgent />,
          },
          {
            path: "pendingRegister",
            element: (
              <Suspense fallback={<LoaderCard />}>
                <ListOfPendingRegistered />
              </Suspense>
            ),
          },
          {
            path: "licensed",
            element: (
              <Suspense fallback={<LoaderCard />}>
                <ListOfLiscenced />
              </Suspense>
            ),
          },
          {
            path: "unlicensed",
            element: (
              <Suspense fallback={<LoaderCard />}>
                <ListOfUnliscenced />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "sales-encoding",
        element: (
          <Suspense fallback={<Loader />}>
            <SalesEncodingContainer />
          </Suspense>
        ),
      },
      {
        path: "brokerage-property",
        element: (
          <Suspense fallback={<Loader />}>
            <BrokerageProperty />
          </Suspense>
        ),
      },
      {
        path: "sales-report",
        element: (
          <Suspense fallback={<Loader />}>
            <SalesReport />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/athomes/agent-broker",
    element: (
        <ProtectedRoute element={<AgentBrokerLayout />} allowedRoles={['0', '1', '2']}/>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/athomes/agent-broker/user-dashboard" />,
      },
      {
        path: "user-dashboard",
        element: (
          <Suspense fallback={<Loader />}>
            <DashboardAgentBroker />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*", 
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode>
  <RouterProvider router={router} />
</React.StrictMode>,
)