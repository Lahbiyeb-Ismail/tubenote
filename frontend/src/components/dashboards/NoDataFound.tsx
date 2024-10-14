import AddNoteForm from "./AddNoteForm";

type NoDataFoundProps = {
	title: string;
};

function NoDataFound({ title }: NoDataFoundProps) {
	return (
		<div className="height_viewport_full flex flex-col items-center justify-center">
			<h2 className="mb-4 text-2xl font-semibold text-gray-800">{title}</h2>
			<p className="mb-6 text-gray-600">
				Start by adding a YouTube video to take notes on.
			</p>
			<AddNoteForm />
		</div>
	);
}

export default NoDataFound;
