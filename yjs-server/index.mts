import * as Y from 'yjs';
import dotenv from 'dotenv';
import api from './axios';
import { Server } from '@hocuspocus/server';
import { logger } from './logger.mts';

dotenv.config();

const server = new Server({
    port: Number(process.env.PORT),
    debounce: parseInt(process.env.DEBOUNCE!) || 1000,
    maxDebounce: 5000,
    quiet: false,

    async onLoadDocument({ documentName }) {
        logger.info(`Loading document: ${documentName}`);
    }
})