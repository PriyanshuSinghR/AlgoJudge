import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Layout from "./components/common/Layout";

const Home = () => <div className="p-4">Home Page</div>;
const Problems = () => <div className="p-4">All Problems Page</div>;
const SingleProblem = () => <div className="p-4">Single Problem Page</div>;
const Submissions = () => <div className="p-4">Submissions Page</div>;

// ← OUTSIDE the component, so JSX elements are not recreated on every render
const APP_ROUTES = [
	{ path: "", element: <Home />, permission: "public" },
	{ path: "/problems", element: <Problems />, permission: "public" },
	{ path: "/problem/:id", element: <SingleProblem />, permission: "protected" },
	{ path: "/submissions", element: <Submissions />, permission: "protected" },
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
