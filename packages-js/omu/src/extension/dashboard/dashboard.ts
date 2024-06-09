import type { App } from '../../app.js';

import type { PermissionRequestPacket, PluginRequestPacket } from './packets.js';

export interface DashboardHandler {
    handlePermissionRequest(request: PermissionRequestPacket): Promise<boolean>;
    handlePluginRequest(request: PluginRequestPacket): Promise<boolean>;
    handleOpenApp(app: App): Promise<void>;
}
