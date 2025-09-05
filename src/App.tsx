import {Suspense, lazy} from "react";
import {BrowserRouter as Router , Route , Routes, Outlet} from "react-router-dom";
import './App.css'
import {Toaster} from "./components/ui/sonner.tsx";
import SignUpPage from "./pages/auth/sign-up.tsx";
import DashboardPage from "./pages/dashboard/dashboard.tsx";
import TaskPage from "./pages/dashboard/task.tsx";
import {SidebarProvider, SidebarTrigger} from "./components/ui/sidebar.tsx";
import {AppSidebar} from "./components/app-sidebar.tsx";
import UserPage from "./pages/dashboard/user.tsx";
const SignInPage = lazy(() => import("./pages/auth/sign-in.tsx"));


function DashboardLayout() {

    // const [defaultOpen, setDefaultOpen] = useState(true);
    //
    // useEffect(() => {
    //     const savedState = localStorage.getItem('sidebar_state');
    //     if (savedState !== null) {
    //         setDefaultOpen(savedState === 'true');
    //     }
    // }, []);
    //
    // const handleOpenChange = (open) => {
    //     localStorage.setItem('sidebar_state', open.toString());
    // };


    return (
        <SidebarProvider
            // defaultOpen={defaultOpen}
            // onOpenChange={handleOpenChange}
        >
            <AppSidebar />
            <main >
                <SidebarTrigger />
                <div className={'w-full'}>
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    );
}

function AuthLayout() {
    return (
        <div className="auth-layout">
            <Outlet />
        </div>
    );
}

function App() {
    return (
        <Router>
            <Toaster/>
            <Suspense fallback={
                <div className="flex h-screen justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            }>
                <Routes>
                    <Route path="/" element={<AuthLayout />}>
                        <Route index element={<SignInPage/>} />
                        <Route path="sign-up" element={<SignUpPage/>} />
                    </Route>

                    {/* with sidebar*/}
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardPage/>} />
                        <Route path="/dashboard/task/:id" element={<TaskPage />}/>
                        <Route path="/dashboard/user" element={<UserPage />}/>
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    )
}

export default App