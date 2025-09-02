export interface IVideoTranscriptQueryDto {
  ytVideoId: string;
  language: string;
  format: "text" | "json";
  timestamps: boolean;
  startTime?: string | undefined;
  endTime?: string | undefined;
}
