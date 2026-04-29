import * as Y from 'yjs'
import { Server } from '@hocuspocus/server'
import axios from 'axios'

const host_url = 'api.shikii.dev'
const DEBOUND_TIME = 850
const debouncers = new Map()

const server = new Server({
    port: 1234,

    async onChange(data) {
        const { document } = data;

        console.log(`Document ${document.name} changed. Preparing to sync...`)

        if (debouncers.has(document.name)) {
            clearTimeout(debouncers.get(document.name))
        }

        const timeout = setTimeout(async () => {
            const update = Y.encodeStateAsUpdate(document)
            const base64Update = Buffer.from(update).toString('base64')
            try {
                await axios.post(`https://${host_url}/api/v1/yjs-callback`, {
                    documentName: document.name,
                    data: base64Update
                }, {
                    headers: { 'Content-Type': 'application/json' }
                })

                console.log(`Synced ${document.name} to Laravel!`)
            } catch (error) {
                console.error('Failed to sync to Laravel:', error.message)
            }
        }, DEBOUND_TIME);

        debouncers.set(document.name, timeout);
    },

    async onConnect() {
        console.log(`A user joined`)
    }
})

server.listen();
