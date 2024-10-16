import type { NoteAction, NoteState } from '@/types/note.types';

export const noteInitialState: NoteState = {
  note: null,
  message: null,
  success: false,
};

function noteReducer(state: NoteState, action: NoteAction): NoteState {
  switch (action.type) {
    case 'CREATE_NOTE_SUCCESS':
      return {
        ...state,
        note: action.payload.note,
        message: action.payload.message,
        success: true,
      };
    case 'CREATE_NOTE_FAIL':
      return {
        ...state,
        note: null,
        message: action.payload.message,
        success: false,
      };
    case 'GET_NOTE_SUCCESS':
      return {
        ...state,
        note: action.payload.note,
        success: true,
      };
    case 'GET_NOTE_FAIL':
      return {
        ...state,
        note: null,
        message: action.payload.message,
        success: false,
      };
    case 'UPDATE_NOTE_SUCCESS':
      return {
        ...state,
        note: action.payload.note,
        success: true,
      };
    case 'UPDATE_NOTE_FAIL':
      return {
        ...state,
        note: null,
        message: action.payload.message,
        success: false,
      };
    case 'CLEAR_NOTE_STATE':
      return {
        ...noteInitialState,
      };
    default:
      return state;
  }
}

export default noteReducer;
