import StepsList from "@/components/global/StepsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, PlayCircle, BookOpen, FileCheck } from "lucide-react";

export default function HowItWorks() {
	return (
		<section className="py-16 bg-gradient-to-br from-purple-100 via-pink-100 to-red-100">
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-extrabold text-gray-900 mb-4">
						How It{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600">
							Works
						</span>
					</h2>
					<p className="text-xl text-gray-700">
						Take notes on YouTube videos in four simple steps
					</p>
				</div>

				<StepsList />

				<div className="text-center mt-12">
					<Button
						size="lg"
						className="bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700"
					>
						Get Started Now
					</Button>
				</div>
			</div>
		</section>
	);
}
