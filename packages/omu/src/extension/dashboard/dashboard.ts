import type { AppJson } from '../../app.js';
import { App } from '../../app.js';
import type { Model } from '../../model.js';
import type { PermissionTypeJson } from '../permission/permission.js';
import { PermissionType } from '../permission/permission.js';

type PermissionRequestJson = {
    request_id: number;
    app: AppJson;
    permissions: PermissionTypeJson[];
}

export class PermissionRequest implements Model<PermissionRequestJson> {
    constructor(
        public readonly requestId: number,
        public readonly app: App,
        public readonly permissions: PermissionType[],
    ) { }

    toJson(): PermissionRequestJson {
        return {
            request_id: this.requestId,
            app: this.app.toJson(),
            permissions: this.permissions.map(permission => permission.toJson()),
        };
    }

    static fromJson(json: PermissionRequestJson): PermissionRequest {
        return new PermissionRequest(
            json.request_id,
            App.fromJson(json.app),
            json.permissions.map(PermissionType.fromJson),
        );
    }
}

export interface DashboardHandler {
    handlePermissionRequest(request: PermissionRequest): Promise<boolean>;
}
