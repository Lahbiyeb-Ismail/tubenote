import { Button } from "@/components/ui/button";
import { PlayCircle, Pencil, Rocket } from "lucide-react";
import Link from "next/link";

export default function Hero() {
	return (
		<div className="height_viewport bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex items-center">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<main className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					<div className="space-y-6">
						<h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight text-center md:text-start">
							Unlock the Power of{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600">
								Video Learning
							</span>
						</h1>
						<p className="text-xl text-gray-700 text-center md:text-start">
							Unleash your inner note-taking powers with TubeNote - the ultimate
							sidekick for conquering knowledge from the video galaxies.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center md:justify-start">
							<Link href="/dashboard" className="grid">
								<Button
									size="lg"
									className="bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700"
								>
									Get Started
									<Rocket className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							<Link href="/" className="grid">
								<Button
									size="lg"
									variant="outline"
									className="border-gray-400 text-gray-700 hover:bg-gray-100"
								>
									<PlayCircle className="mr-2 h-5 w-5" />
									Watch Demo
								</Button>
							</Link>
						</div>
					</div>
					<div className="relative hidden md:block">
						<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-400 to-purple-400 rounded-2xl transform rotate-3" />
						<div className="relative bg-white p-8 rounded-2xl shadow-xl">
							<div className="flex items-center justify-between mb-4">
								<div className="flex space-x-2">
									<div className="w-3 h-3 rounded-full bg-red-500" />
									<div className="w-3 h-3 rounded-full bg-yellow-500" />
									<div className="w-3 h-3 rounded-full bg-green-500" />
								</div>
								<Pencil className="text-gray-400" />
							</div>
							<div className="space-y-4">
								<div className="h-4 bg-gray-200 rounded w-3/4" />
								<div className="h-4 bg-gray-200 rounded" />
								<div className="h-4 bg-gray-200 rounded w-5/6" />
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
