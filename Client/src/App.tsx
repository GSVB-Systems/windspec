import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import {createBrowserRouter, Outlet, RouterProvider} from "react-router";
import ProtectedRoute from "./components/ProtectedRouting/ProtectedRoute.tsx";

function App() {
    return (
        <RouterProvider router={createBrowserRouter([
            {
                path: "/",
                element: <Outlet/>,
                children: [
                    {
                        index: true,
                        element: (
                            <ProtectedRoute>
                                <Dashboard/>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "/login",
                        element: <LoginPage/>
                    }
                ]
            }
        ])}/>
    );
}
export default App;