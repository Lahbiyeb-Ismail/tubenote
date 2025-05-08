# State Management Optimization

This document explains the state management optimization implemented in the TubeNote v2 application.

## Overview

We've transitioned from a React Context-based state management approach to a more optimized solution using Zustand. This change helps:

- Reduce unnecessary re-renders
- Improve performance
- Provide better state separation
- Enable more targeted component updates

## Implementation Details

### Zustand Stores

We've created separate stores for different domains of the application:

- **UI Store** (`ui-store.ts`): Manages UI state like modals and layout preferences
- **Auth Store** (`auth-store.ts`): Handles authentication state
- **Note Store** (`note-store.ts`): Manages notes, selected notes, and note operations
- **Video Store** (`video-store.ts`): Handles video data and playback state
- **User Store** (`user-store.ts`): Manages user profile information

### Backward Compatibility

For backward compatibility, we've maintained the existing Context Provider APIs but updated them to use our Zustand stores internally. This allows for a gradual migration where components can:

1. Continue using the context hooks (`useLayout`, `useModal`, etc.)
2. Directly use the Zustand stores for better performance

### Optimized Hooks

We've created several hooks to access state in an optimized way:

- `useVideoNoteSelector`: Combines video and note state with proper memoization
- `useCombinedState`: Access multiple stores while preventing unnecessary re-renders

### Store Provider

The `StoreProvider` component initializes all Zustand stores and handles any global state setup that was previously managed by individual context providers.

## Usage Examples

### Using Zustand Store Directly

```tsx
import { useUIStore } from "@/stores";

function MyComponent() {
  // Only re-renders when isGridLayout changes
  const isGridLayout = useUIStore((state) => state.layout.isGridLayout);
  const toggleLayout = useUIStore((state) => state.actions.toggleLayout);
  
  return (
    <button onClick={toggleLayout}>
      {isGridLayout ? "Switch to List View" : "Switch to Grid View"}
    </button>
  );
}
```

### Using Selector Hooks

```tsx
import { useVideoNoteSelector } from "@/hooks";

function VideoNotesComponent({ videoId }) {
  // Only re-renders when relevant data changes
  const { notes, selectedNote, selectNote } = useVideoNoteSelector(videoId);
  
  return (
    <div>
      {notes.map(note => (
        <div 
          key={note.id}
          onClick={() => selectNote(note.id)}
          className={selectedNote?.id === note.id ? "selected" : ""}
        >
          {note.title}
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Use Selectors Wisely**: Only select the specific state properties you need
2. **Use Shallow Comparison**: For objects, use `shallow` comparison to prevent unnecessary re-renders
3. **Memoize Actions**: Use `useCallback` for actions to prevent unnecessary function recreations
4. **Component Optimization**: Split components based on which parts of state they need

## Migration Guide

1. Identify components using context and determine if they would benefit from direct store access
2. For components that need data from multiple contexts, use the combined selector hooks
3. Test performance improvements by measuring render counts

## Future Improvements

- Further separate read and write operations for better performance
- Add persistence layer with `zustand/middleware/persist`
- Implement middleware for logging in development
