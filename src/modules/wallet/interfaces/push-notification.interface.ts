export interface PushNotificationInterface {

    readonly endpoint: string;
    readonly expirationTime: string;
    readonly keys: PushNotificationKeyInterface;

}

interface PushNotificationKeyInterface {

    readonly p256dh: string;
    readonly auth: string;

}
