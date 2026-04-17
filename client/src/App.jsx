import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Layout from "./components/common/Layout";
import ProblemsPage from "./pages/Problems";
import CreateProblemPage from "./pages/CreateProblem";
import EditProblemPage from "./pages/EditProblem";
import SingleProblemPage from "./pages/SingleProblem";
import CompilerPage from "./pages/Compiler";

const Home = () => <div className="p-4">Home Page</div>;

// ← OUTSIDE the component, so JSX elements are not recreated on every render
const APP_ROUTES = [
	{ path: "", element: <Home />, permission: "public" },
	{ path: "/problems", element: <ProblemsPage />, permission: "public" },
	{
		path: "/create-problem",
		element: <CreateProblemPage />,
		permission: "protected",
	},
	{
		path: "/edit-problem/:id",
		element: <EditProblemPage />,
		permission: "protected",
	},
	{
		path: "/problem/:slug",
		element: <SingleProblemPage />,
		permission: "public",
	},
	{
		path: "/compiler",
		element: <CompilerPage />,
		permission: "public",
	},
	{ path: "/signin", element: <SignInPage />, permission: "guest" },
	{ path: "/signup", element: <SignUpPage />, permission: "guest" },
];

export default function App() {
	return (
		<Routes>
			{APP_ROUTES.map(({ path, element, permission }) => (
				<Route
					key={path}
					path={path}
					element={<Layout permission={permission}>{element}</Layout>}
				/>
			))}
		</Routes>
	);
}
