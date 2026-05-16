import * as Y from 'yjs';
import api from './axios.mts';
import { Server } from '@hocuspocus/server';
import { logger } from './logger.mts';

const NOTE_DOC_PREFIX = 'note-';

type Permission = 'OWNER' | 'READ_AND_WRITE' | 'WRITE' | 'READ';

interface AuthContext {
    userId: number;
    token: string;
    noteId: number;
    permission: Permission;
    initialBinary: string | null;
}

function parseNoteId(documentName: string): number | null {
    if (!documentName.startsWith(NOTE_DOC_PREFIX)) return null;
    const id = Number(documentName.slice(NOTE_DOC_PREFIX.length));
    return Number.isInteger(id) && id > 0 ? id : null;
}

const PORT = Number(process.env.PORT) || 1234;

const server = new Server({
    port: PORT,
    debounce: parseInt(process.env.DEBOUNCE!) || 1000,
    maxDebounce: 5000,
    quiet: false,

    async onAuthenticate({ documentName, token, connectionConfig }) {
        const noteId = parseNoteId(documentName);
        if (!noteId) {
            throw new Error(`Invalid document name: ${documentName}`);
        }
        if (!token) {
            throw new Error('Missing token');
        }

        let note;
        try {
            const response = await api.get(`/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            note = response.data;
        } catch (err: any) {
            const status = err.response?.status;
            logger.warn(`Auth rejected for note ${noteId}: HTTP ${status ?? '?'}`);
            throw new Error('Unauthorized');
        }

        const permission = note?.viewer_permission as Permission | null;
        if (!permission) {
            throw new Error('Forbidden');
        }
        if (note.is_locked) {
            // Locked notes can't be collaboratively edited until unlocked
            // (the content isn't even returned by the API while locked).
            throw new Error('Note is locked');
        }

        const canWrite =
            permission === 'OWNER' ||
            permission === 'READ_AND_WRITE' ||
            permission === 'WRITE';
        connectionConfig.readOnly = !canWrite;

        const initialBinary =
            typeof note.content_binary === 'string' && note.content_binary.length > 0
                ? note.content_binary
                : null;

        const ctx: AuthContext = {
            userId: note.user_id,
            token,
            noteId,
            permission,
            initialBinary,
        };
        logger.info(
            `Authed user=${ctx.userId} perm=${permission} note=${noteId} readonly=${!canWrite}`,
        );
        return ctx;
    },

    async onLoadDocument({ documentName, document, context }) {
        const ctx = context as AuthContext | undefined;
        if (!ctx?.initialBinary) {
            logger.info(`No existing yjs state for ${documentName}`);
            return document;
        }

        try {
            const bytes = Buffer.from(ctx.initialBinary, 'base64');
            if (bytes.byteLength > 0) {
                Y.applyUpdate(document, bytes);
                logger.info(`Loaded ${bytes.byteLength} bytes for ${documentName}`);
            }
        } catch (err: any) {
            logger.error(`Decode failed for ${documentName}: ${err.message}`);
        }

        return document;
    },

    async onStoreDocument({ documentName, document }) {
        const noteId = parseNoteId(documentName);
        if (!noteId) return;

        const update = Y.encodeStateAsUpdate(document);
        const data = Buffer.from(update).toString('base64');

        try {
            await api.post('/yjs-callback', { documentName, data });
            logger.info(`Stored ${documentName} (${update.byteLength} bytes)`);
        } catch (err: any) {
            const status = err.response?.status;
            logger.error(
                `Store failed for ${documentName}: HTTP ${status ?? '?'} ${err.message}`,
            );
        }
    },

    async onDisconnect({ documentName, context, clientsCount }) {
        const ctx = context as AuthContext | undefined;
        logger.info(
            `Disconnect ${documentName} user=${ctx?.userId ?? '?'} remaining=${clientsCount}`,
        );
    },
});

server.listen();
logger.info(`Hocuspocus server listening on port ${PORT}`);
