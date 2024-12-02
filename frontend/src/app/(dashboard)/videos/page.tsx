"use client";

import useGetUserVideos from "@/hooks/note/useGetUserVideos";

import AddNoteForm from "@/components/dashboards/AddNoteForm";
import Header from "@/components/dashboards/Header";
import NoDataFound from "@/components/dashboards/NoDataFound";
import Loader from "@/components/global/Loader";
import VideosList from "@/components/video/VideosList";

function VideosPage() {
	const { data: videos, isLoading, isError } = useGetUserVideos();

	if (isError) return <div>Something went wrong</div>;

	if (isLoading) return <Loader />;

	if (!videos || videos.length === 0) {
		return <NoDataFound title="You don't have any videos yet." />;
	}

	return (
		<div className="min-h-screen flex-1 bg-gray-100">
			<Header title="Your Video" />
			<main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
				<div className="flex justify-end">
					<AddNoteForm />
				</div>
				<VideosList videos={videos} />
			</main>
		</div>
	);
}

export default VideosPage;
