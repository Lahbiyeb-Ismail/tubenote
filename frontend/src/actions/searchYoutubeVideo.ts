import type { SearchFormType } from "@/types";
import type { SubmitHandler } from "react-hook-form";

const searchYoutubeVideo: SubmitHandler<SearchFormType> = (
  data: SearchFormType
) => {
  const { videoUrl } = data;
};

export default searchYoutubeVideo;
