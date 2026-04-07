import { Routes, Route } from "react-router-dom";

import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

const Home = () => <div className="p-4">Home Page</div>;
const Problems = () => <div className="p-4">All Problems Page</div>;
const SingleProblem = () => <div className="p-4">Single Problem Page</div>;
const Submissions = () => <div className="p-4">Submissions Page</div>;

export default function App() {
	const APP_ROUTES = [
		{
			path: "",
			element: <Home />,
			metaTitle: "Home",
		},
		{
			path: "/problems",
			element: <Problems />,
			metaTitle: "All Problems",
		},
		{
			path: "/problem/:id",
			element: <SingleProblem />,
			metaTitle: "Single Problem",
		},
		{
			path: "/submissions",
			element: <Submissions />,
			metaTitle: "Submissions",
		},
	];

	return (
		<Routes>
			{APP_ROUTES.map(({ path, element, metaTitle }) => (
				<Route key={path} path={path} element={element} />
			))}

			<Route path="/signin" element={<SignInPage />} />
			<Route path="/signup" element={<SignUpPage />} />
		</Routes>
	);
}
