/* tslint:disable */
/* eslint-disable */
/**
 * MobyLab Web App
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { UserRoleEnum } from './UserRoleEnum';
import {
    UserRoleEnumFromJSON,
    UserRoleEnumFromJSONTyped,
    UserRoleEnumToJSON,
} from './UserRoleEnum';

/**
 * 
 * @export
 * @interface ApiUserAddPostRequest
 */
export interface ApiUserAddPostRequest {
    /**
     * 
     * @type {string}
     * @memberof ApiUserAddPostRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ApiUserAddPostRequest
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof ApiUserAddPostRequest
     */
    password: string;
    /**
     * 
     * @type {UserRoleEnum}
     * @memberof ApiUserAddPostRequest
     */
    role: UserRoleEnum;
}

/**
 * Check if a given object implements the ApiUserAddPostRequest interface.
 */
export function instanceOfApiUserAddPostRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "email" in value;
    isInstance = isInstance && "password" in value;
    isInstance = isInstance && "role" in value;

    return isInstance;
}

export function ApiUserAddPostRequestFromJSON(json: any): ApiUserAddPostRequest {
    return ApiUserAddPostRequestFromJSONTyped(json, false);
}

export function ApiUserAddPostRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ApiUserAddPostRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'email': json['email'],
        'password': json['password'],
        'role': UserRoleEnumFromJSON(json['roles']),
    };
}

export function ApiUserAddPostRequestToJSON(value?: ApiUserAddPostRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'email': value.email,
        'password': value.password,
        'role': UserRoleEnumToJSON(value.role),
    };
}

