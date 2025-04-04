import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import NotFound from './notFound';
import './index.css';
import Admin from './views/admin/AdminLayouts';
import AgentBrokerLayout from './views/agent/AgentBrokerLayout';
import Loader from './components/loader';
import LoaderAdmin from './components/loaderAdmin';
import LoaderCard from './components/loaderCard';
import ListOfBrokerAgent from './views/admin/affialiated/table/ListOfBrokerAgent';
import ProtectedRoute from './jwt/ProtectedRoute';
import PublicRoute from './jwt/PublicRoute';

const Login = lazy(() =>
  wait(3000).then(() => import("./views/auth/login/Login"))
);

const Register = lazy(() =>
  wait(3000).then(() => import("./views/auth/register/Register"))
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
    path: "/",
    element: <Navigate to="/athomes/user-login" />,
  },
  {
    path: "/athomes/user-login",
    element: (
      <PublicRoute>
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: "/athomes/user-register",
    element: (
      <PublicRoute>
        <Suspense fallback={<Loader />}>
          <Register />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: "/athomes/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/athomes/admin/user-dashboard" />,
      },
      {
        path: "user-dashboard",
        element: (
          <Suspense fallback={<LoaderAdmin />}>
            <DashboardContainer />
          </Suspense>
        ),
      },
      {
        path: "developer",
        element: (
          <Suspense fallback={<LoaderAdmin />}>
            <DeveloperContainer />
          </Suspense>
        ),
      },
      {
        path: "affialiated",
        element: (
          <Suspense fallback={<LoaderAdmin />}>
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
          <Suspense fallback={<LoaderAdmin />}>
            <SalesEncodingContainer />
          </Suspense>
        ),
      },
      {
        path: "brokerage-property",
        element: (
          <Suspense fallback={<LoaderAdmin />}>
            <BrokerageProperty />
          </Suspense>
        ),
      },
      {
        path: "sales-report",
        element: (
          <Suspense fallback={<LoaderAdmin />}>
            <SalesReport />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/athomes/agent-broker",
    element: (
      <ProtectedRoute>
        <AgentBrokerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/athomes/agent-broker/user-dashboard" />,
      },
      {
        path: "user-dashboard",
        element: (
          <Suspense fallback={<LoaderAdmin />}>
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