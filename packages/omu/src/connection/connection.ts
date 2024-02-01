import type { EventData, EventType } from '../event/index.js';

import type { Address } from './address.js';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export interface Connection {
    readonly address: Address;
    readonly connected: boolean;

    connect(): Promise<void>;
    disconnect(): void;
    send<T>(event: EventType<T>, data: T): void;
    status(): ConnectionStatus;

    proxy(url: string): string;
    asset(url: string): string;

    addListener(listener: ConnectionListener): void;
    removeListener(listener: ConnectionListener): void;
    addTask(task: () => void): void;
    removeTask(task: () => void): void;
}

export interface ConnectionListener {
    onConnect?(): void;
    onDisconnect?(): void;
    onEvent?(event: EventData): void;
    onStatusChanged?(status: ConnectionStatus): void;
}
