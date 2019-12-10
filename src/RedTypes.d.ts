declare module 'RedTypes' {
    import { Command } from 'discord.js-commando';
    import { Song } from 'components/Utils';
    import { Snowflake, TextChannel, VoiceChannel, VoiceConnection } from 'discord.js';

    export type MusicCommand = {
        queue: Map<string, MusicQueueType>;
        votes: Map<Snowflake, MusicVoteType>;
    } & Command;

    export interface MusicQueueType {
        textChannel: TextChannel;
        voiceChannel: VoiceChannel;
        connection: VoiceConnection | null;
        songs: Song[];
        volume: number;
        playing: boolean;
        isTriggeredByStop?: boolean;
    }

    export interface MusicVoteType {
        count: number;
        users: Snowflake[];
        queue: MusicQueueType;
        guild: Snowflake;
        start: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timeout: any;
    }

    export interface YoutubeVideoType {
        id: string;
        title: string;
        kind: string;
        etag?: string;
        durationSeconds: number;
        contentDetails?: YoutubeVideoContentDetailsType;
        snippet?: YoutubeVideoSnippetType;
    }

    interface YoutubeVideoContentDetailsType {
        videoId: string;
        videoPublishedAt: string;
    }

    export interface YoutubeVideoSnippetType {
        channelId: string;
        channelTitle: string;
        description: string;
        playlistId?: string;
        position?: number;
        publishedAt: string;
        resourceId: YoutubeVideoResourceType;
        thumbnails: YoutubeVideoThumbnailType;
        title: string;
        liveBroadcastContent: string;
    }

    interface YoutubeVideoThumbnailType {
        default: { height: number; width: null; url: string };
        high?: { height: number; width: null; url: string };
        medium?: { height: number; width: null; url: string };
        standard?: { height: number; width: null; url: string };
    }

    export interface YoutubeVideoResourceType {
        kind: string;
        videoId: string;
    }

    export interface YoutubeResultList {
        etag: string;
        items: {
            contentDetails: YoutubeVideoContentDetailsType;
            etag: string;
            id: YoutubeVideoResourceType;
            kind: string;
            snippet: YoutubeVideoSnippetType;
        }[];
        kind: string;
        nextPageToken: string;
        pageInfo: { resultsPerPage: number; totalResults: number };
    }

}