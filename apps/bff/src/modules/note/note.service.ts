import type { Note } from "@tubenote/db";
import type { ICreateNoteDto, ISearchAndPaginationQueryDto, IUpdateNoteDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import { axiosInstance } from "@/lib/axios";
import { sessionCacheService } from "@/services";

export class NoteService {
  async countByYtVideoId(sessionId: string, ytVideoId: string): Promise<IApiSuccessResponse<number>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to access this resource");
    }

    const noteRes = await axiosInstance.get<IApiSuccessResponse<number>>(`/notes/count/${ytVideoId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
    });

    return noteRes.data;
  }

  async findAllByVideoId(sessionId: string, videoId: string): Promise<IApiSuccessResponse<Note[]>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to access this resource");
    }

    const noteRes = await axiosInstance.get<IApiSuccessResponse<Note[]>>(`/notes/video/${videoId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
    });

    return noteRes.data;
  }

  async create(sessionId: string, noteData: ICreateNoteDto, videoId: string): Promise<IApiSuccessResponse<Note>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to access this resource");
    }

    const noteRes = await axiosInstance.post<IApiSuccessResponse<Note>>(`/notes/${videoId}`, noteData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
    });

    return noteRes.data;
  }

  async update(sessionId: string, noteId: string, noteData: IUpdateNoteDto): Promise<IApiSuccessResponse<Note>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to access this resource");
    }

    const noteRes = await axiosInstance.patch<IApiSuccessResponse<Note>>(`/notes/${noteId}`, noteData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
    });

    return noteRes.data;
  }

  async findByNoteId(sessionId: string, noteId: string): Promise<IApiSuccessResponse<Note>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to access this resource");
    }

    const noteRes = await axiosInstance.get<IApiSuccessResponse<Note>>(`/notes/${noteId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
    });

    return noteRes.data;
  }

  async delete(sessionId: string, noteId: string): Promise<IApiSuccessResponse<null>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to access this resource");
    }

    const noteRes = await axiosInstance.delete<IApiSuccessResponse<null>>(`/notes/${noteId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
    });

    return noteRes.data;
  }

  async findAll(sessionId: string, queryOptions: ISearchAndPaginationQueryDto): Promise<IApiSuccessResponse<Note[]>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to access this resource");
    }

    const { page, q, limit, order, sortBy } = queryOptions;

    const noteRes = await axiosInstance.get<IApiSuccessResponse<Note[]>>(`/notes?page=${page}&q=${q}&limit=${limit}&order=${order}&sortBy=${sortBy}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
    });

    return noteRes.data;
  }
}
