import { Button } from "./components/ui/button";

function App() {
	return (
		<>
			<h1 className="text-3xl text-center font-bold mt-10">
				Hello Welcome to algo judge
			</h1>
			<div className="flex min-h-svh flex-col items-center justify-center">
				<Button variant="destructive">Click me</Button>
				<Button variant="outline">Click me</Button>
			</div>
		</>
	);
}

export default App;
