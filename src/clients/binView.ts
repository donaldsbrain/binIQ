import io, { Socket } from 'socket.io-client';
import { ClientToServiceEvents, ServiceToClientEvents } from '../../backend/src/domain/events';
import { Observable, Subject } from 'rxjs';
import { BinLayout } from '../../backend/src/domain/binLayout';
import { wait } from 'hmi/src/utility/time';

let nextClientId = 0;

export type BinViewClient = {
    id: number
    disconnect: () => void
    updates: Observable<BinLayout>
}

export const getClient = (layoutId: string): Promise<BinViewClient> => 
    fetch(`/api/bin-layouts/${layoutId}`)
        .then(response => response.status === 200 ? response.json() : Promise.reject(response))
        .then((layout: BinLayout) => {
            const clientId = nextClientId;
            console.log(`Client ${clientId}: settings loaded.`)
            const subject = new Subject<BinLayout>();
            let quitBeforeWeStarted = false;
            let disconnectActions: (() => void)[] = [() => quitBeforeWeStarted = true];            
            wait(100).then(() => {
                subject.next(layout);
                // a short wait prevents an early disconnect error when vite double renders components in dev mode
                if (quitBeforeWeStarted) {
                    console.log(`Client ${clientId}: quit before connecting to websocket. (Silly Vite.)`)
                    return;
                }
                const socket: Socket<ServiceToClientEvents, ClientToServiceEvents> = io('/spectate', {
                    transports: ['websocket'], // Optional, to use WebSockets only
                });
                
                socket.on('connect', () => {
                    socket.on('layoutUpdated', (arena: BinLayout) => {
                        subject.next(arena);
                    });                    
                });

                disconnectActions.push(() => {                    
                    socket.disconnect();
                });
            });

            return {                
                id: nextClientId++,
                disconnect: () => disconnectActions.forEach(action => action()),
                updates: subject
            }
        })
        
