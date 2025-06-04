# YouTube API Package

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/tubenote)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](https://opensource.org/licenses/ISC)

A package for interacting with the YouTube Data API to fetch and parse video metadata, including title, description, thumbnails, and video chapters.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Structures](#data-structures)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🎬 Fetch detailed metadata for YouTube videos
- 📊 Extract and parse video chapters from description
- 🕒 Parse YouTube ISO 8601 duration formats
- 🖼️ Access multiple thumbnail sizes and quality options
- 🔄 Convert between timestamp formats (HH:MM:SS, seconds)
- 🔒 Environment configuration with Zod validation

## Installation

This package is part of the TubeNote monorepo and is designed to be used with the other TubeNote packages. To install and use it within the monorepo:

```bash
# From the root of the monorepo
pnpm install

# To build just this package
pnpm --filter @tubenote/youtube-api build
```

## Usage

```typescript
import { youtubeApiService } from "@tubenote/youtube-api";

// Fetch video data
async function getVideoDetails(videoId: string) {
  try {
    const videoData = await youtubeApiService.getYoutubeVideoData(videoId);

    console.log(`Title: ${videoData.title}`);
    console.log(`Channel: ${videoData.channelTitle}`);
    console.log(`Description: ${videoData.description.substring(0, 100)}...`);

    // Access thumbnails
    const thumbnailUrl = videoData.thumbnails.high.url;

    // Display chapters
    videoData.videoChapters.forEach((chapter) => {
      console.log(`${chapter.rawStartTimestamp} - ${chapter.chapterLabel}`);
    });

    return videoData;
  }
  catch (error) {
    console.error("Failed to fetch video data:", error);
    throw error;
  }
}
```

## Environment Variables

Create an `.env` file in the root of the package with the following variables:

```
YOUTUBE_API_URL=https://www.googleapis.com/youtube/v3
YOUTUBE_API_KEY=your_youtube_api_key
```

The environment variables are validated using Zod schema validation to ensure they meet the expected format.

## API Reference

### YoutubeApiService

#### `getYoutubeVideoData(youtubeId: string): Promise<YoutubeVideoData>`

Fetches and processes detailed information about a YouTube video.

**Parameters:**

- `youtubeId` - The YouTube video ID (e.g., "dQw4w9WgXcQ")

**Returns:**

- A promise that resolves to a `YoutubeVideoData` object containing video metadata

## Data Structures

### YoutubeVideoData

```typescript
interface YoutubeVideoData {
  youtubeId: string;
  title: string;
  description: string;
  channelTitle: string;
  tags: string[];
  embedHtmlPlayer: string;
  thumbnails: Thumbnails;
  videoChapters: VideoChapter[];
}
```

### VideoChapter

```typescript
interface VideoChapter {
  startTime: number; // seconds from video start
  endTime: number; // seconds from video start
  chapterLabel: string; // e.g., "Introduction"
  rawStartTimestamp: string; // e.g., "00:00" or "01:23:45"
  rawEndTimestamp: string; // e.g., "01:45" or "02:30:10"
}
```

### Thumbnails

```typescript
interface Thumbnails {
  default: ThumbnailSize; // smallest size (typically 120x90)
  medium: ThumbnailSize; // medium size (typically 320x180)
  high: ThumbnailSize; // high definition size (typically 480x360)
  standard: ThumbnailSize; // standard definition size (typically 640x480)
  maxres: ThumbnailSize; // maximum resolution size (typically 1280x720)
}

interface ThumbnailSize {
  url: string;
  width: number;
  height: number;
}
```

## Contributing

To contribute to this package:

1. Make sure you have set up the environment variables correctly
2. Run `pnpm dev` to start the development server with watch mode
3. Write or update tests as needed
4. Ensure all tests pass before submitting a PR

## License

ISC
