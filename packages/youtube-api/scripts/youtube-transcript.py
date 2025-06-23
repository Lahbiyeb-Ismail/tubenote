import argparse
import json
import re

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
)


def extract_video_id(url):
    """Extract YouTube video ID from various URL formats."""
    patterns = [
        r"(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([\w-]{11})",
        r"(?:https?://)?youtu\.be/([\w-]{11})",
        r"(?:https?://)?(?:www\.)?youtube\.com/embed/([\w-]{11})",
        r"(?:https?://)?(?:www\.)?youtube\.com/v/([\w-]{11})",
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    if re.match(r"^[\w-]{11}$", url):
        return url

    return None


def parse_timestamp(time_str):
    """Parse timestamp in seconds or HH:MM:SS format to seconds."""
    if ":" in time_str:
        parts = time_str.split(":")
        if len(parts) == 3:  # HH:MM:SS
            hours, minutes, seconds = map(float, parts)
            return hours * 3600 + minutes * 60 + seconds
        elif len(parts) == 2:  # MM:SS
            minutes, seconds = map(float, parts)
            return minutes * 60 + seconds
        else:
            raise ValueError("Invalid timestamp format")
    else:
        try:
            return float(time_str)
        except ValueError:
            raise ValueError("Timestamp must be a number or HH:MM:SS format")


def format_seconds(seconds):
    """Convert seconds to HH:MM:SS format."""
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{int(hours):02d}:{int(minutes):02d}:{int(seconds):02d}"


def filter_transcript(transcript, start_time=None, end_time=None):
    """Filter transcript entries based on start and end times."""
    filtered = []

    for entry in transcript:
        entry_end = entry["start"] + entry["duration"]

        # Include if entry overlaps with the specified time range
        if (start_time is None or entry_end > start_time) and (
            end_time is None or entry["start"] < end_time
        ):

            # Clip text if it starts before our start time
            if start_time and entry["start"] < start_time:
                clip_start = int((start_time - entry["start"]) * 1000)
                entry["text"] = entry["text"][clip_start:]

            filtered.append(entry)

    return filtered


def get_transcript(video_id, language=None):
    """Retrieve transcript for a YouTube video."""
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        if language:
            for transcript in transcript_list:
                if transcript.language_code == language:
                    return transcript.fetch()
            raise NoTranscriptFound(video_id, [language])

        try:
            return YouTubeTranscriptApi.get_transcript(video_id, languages=["en"])
        except:
            return transcript_list.find_transcript([]).fetch()

    except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable) as e:
        raise


def format_transcript(
    transcript, format_type, timestamps=False, start_time=None, end_time=None
):
    """Format transcript for output with improved readability."""
    if format_type == "json":
        return json.dumps(transcript, indent=2, ensure_ascii=False)

    output_lines = []
    current_speaker = None

    # Add time range header if filtering
    if start_time is not None or end_time is not None:
        start_str = format_seconds(start_time) if start_time is not None else "00:00:00"
        end_str = format_seconds(end_time) if end_time is not None else "End"
        output_lines.append(f"--- TRANSCRIPT EXTRACT ({start_str} - {end_str}) ---\n")

    for i, entry in enumerate(transcript):
        text = entry["text"].strip()
        start_sec = entry["start"]
        start_time_str = format_seconds(start_sec)

        # Detect speaker changes
        if ":" in text and i > 0:
            possible_speaker, dialog = text.split(":", 1)
            if len(possible_speaker) < 30 and dialog:
                if possible_speaker != current_speaker:
                    current_speaker = possible_speaker
                    output_lines.append(f"\n{current_speaker}:")
                text = dialog.strip()

        # Add timestamp if requested
        prefix = f"[{start_time_str}] " if timestamps else ""

        # Handle paragraph breaks
        if i > 0 and entry["start"] - transcript[i - 1]["start"] > 5.0:
            output_lines.append("")

        output_lines.append(f"{prefix}{text}")

    return "\n".join(output_lines).strip()


def main():
    parser = argparse.ArgumentParser(
        description="Download YouTube video transcripts with time range filtering."
    )
    parser.add_argument("source", help="YouTube URL or video ID")
    parser.add_argument(
        "-l", "--language", help="Language code (e.g., en, de, fr)", default=None
    )
    parser.add_argument(
        "-o", "--output", help="Output filename (default: video_id.txt)"
    )
    parser.add_argument(
        "-f",
        "--format",
        choices=["text", "json"],
        default="text",
        help="Output format: text (default) or json",
    )
    parser.add_argument(
        "-t",
        "--timestamps",
        action="store_true",
        help="Include timestamps in text output",
    )
    parser.add_argument(
        "-s",
        "--start",
        type=str,
        default=None,
        help="Start time (seconds or HH:MM:SS) for transcript extract",
    )
    parser.add_argument(
        "-e",
        "--end",
        type=str,
        default=None,
        help="End time (seconds or HH:MM:SS) for transcript extract",
    )

    args = parser.parse_args()

    # Parse time range arguments
    start_time = None
    end_time = None

    try:
        if args.start:
            start_time = parse_timestamp(args.start)
        if args.end:
            end_time = parse_timestamp(args.end)

        # Validate time range
        if start_time is not None and end_time is not None and start_time >= end_time:
            raise ValueError("End time must be after start time")

    except ValueError as e:
        print(f"❌ Invalid time format: {str(e)}")
        print("Valid formats: seconds (e.g., 120) or HH:MM:SS (e.g., 00:02:00)")
        return

    video_id = extract_video_id(args.source)
    if not video_id:
        print("❌ Invalid YouTube URL or video ID")
        return

    try:
        # Get full transcript
        transcript = get_transcript(video_id, args.language)

        # Filter transcript by time range
        if start_time is not None or end_time is not None:
            transcript = filter_transcript(transcript, start_time, end_time)

            if not transcript:
                print("❌ No transcript content found in the specified time range")
                return

        # Format transcript
        content = format_transcript(
            transcript, args.format, args.timestamps, start_time, end_time
        )

        # Determine output filename
        ext = "json" if args.format == "json" else "txt"
        output_file = args.output or f"{video_id}.{ext}"

        # Save to file
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(content)

        print(f"✅ Transcript saved to: {output_file}")
        print(
            f"Format: {ext.upper()} | Timestamps: {'Yes' if args.timestamps else 'No'}"
        )
        print(f"Entries: {len(transcript)}", end="")

        if start_time is not None or end_time is not None:
            start_str = (
                format_seconds(start_time) if start_time is not None else "00:00:00"
            )
            end_str = format_seconds(end_time) if end_time is not None else "End"
            print(f" | Time range: {start_str} - {end_str}")
        else:
            print()

    except TranscriptsDisabled:
        print("❌ Subtitles are disabled for this video")
    except NoTranscriptFound:
        print("❌ No transcript available for the requested language")
    except VideoUnavailable:
        print("❌ Video is unavailable or private")
    except Exception as e:
        print(f"❌ An error occurred: {str(e)}")


if __name__ == "__main__":
    main()
