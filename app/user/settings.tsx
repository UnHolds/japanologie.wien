"use client"

export interface UserSettings {
    name: string,
    wanikani: WaniKaniSettings
}

const UserSettingsKey = "settings"

interface WaniKaniSettings {
    api_key: string
}

export function default_settings(): UserSettings {
    return {
        name: "",
        wanikani: {
            api_key: ""
        }
    }
}

export function update_settings(settings: UserSettings) {
    window.localStorage.setItem(UserSettingsKey, JSON.stringify(settings));
}

export function get_settings(): UserSettings {


    const _data = window.localStorage.getItem(UserSettingsKey);


    if(_data == null) {
        return default_settings()
    }else{
        return JSON.parse(_data);
    }
}
