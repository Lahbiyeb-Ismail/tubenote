import type { Note } from "@tubenote/db";
import type { ICreateNoteDto, IPaginationQueryDto, ISearchAndPaginationQueryDto, IUpdateNoteDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import type { ISessionData } from "@/types";

import { axiosInstance } from "@/lib/axios";

export class NoteService {
  async countByYtVideoId(sessionData: ISessionData, ytVideoId: string): Promise<IApiSuccessResponse<number>> {
    const noteRes = await axiosInstance.get<IApiSuccessResponse<number>>(`/notes/count/${ytVideoId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  async findAllByVideoId(sessionData: ISessionData, videoId: string, queryOptions: IPaginationQueryDto): Promise<IApiSuccessResponse<Note[]>> {
    const noteRes = await axiosInstance.get<IApiSuccessResponse<Note[]>>(`/notes/video/${videoId}`, {
      params: queryOptions,
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  async create(sessionData: ISessionData, noteData: ICreateNoteDto, videoId: string): Promise<IApiSuccessResponse<Note>> {
    const noteRes = await axiosInstance.post<IApiSuccessResponse<Note>>(`/notes/${videoId}`, noteData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  async update(sessionData: ISessionData, noteId: string, noteData: IUpdateNoteDto): Promise<IApiSuccessResponse<Note>> {
    const noteRes = await axiosInstance.patch<IApiSuccessResponse<Note>>(`/notes/${noteId}`, noteData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  async findByNoteId(sessionData: ISessionData, noteId: string): Promise<IApiSuccessResponse<Note>> {
    const noteRes = await axiosInstance.get<IApiSuccessResponse<Note>>(`/notes/${noteId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  async delete(sessionData: ISessionData, noteId: string): Promise<IApiSuccessResponse<null>> {
    const noteRes = await axiosInstance.delete<IApiSuccessResponse<null>>(`/notes/${noteId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  async findAll(sessionData: ISessionData, queryOptions: ISearchAndPaginationQueryDto): Promise<IApiSuccessResponse<Note[]>> {
    const noteRes = await axiosInstance.get<IApiSuccessResponse<Note[]>>("/notes", {
      params: queryOptions,
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }
}
