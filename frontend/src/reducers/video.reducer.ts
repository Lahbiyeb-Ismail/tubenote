import type { VideoAction, VideoState } from '@/types/video.types';

export const videoInitialState: VideoState = {
  video: null,
  message: null,
  success: false,
};

function videoReducer(state: VideoState, action: VideoAction): VideoState {
  switch (action.type) {
    case 'SAVE_VIDEO_SUCCESS':
      return {
        ...state,
        video: action.payload.video,
        message: action.payload.message,
        success: true,
      };
    case 'SAVE_VIDEO_FAIL':
      return {
        ...state,
        video: null,
        message: action.payload.message,
        success: false,
      };
    default:
      return state;
  }
}

export default videoReducer;
