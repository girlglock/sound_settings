/*
Copyright (C) 2025 Deana Brcka
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <www.gnu.org/licenses/>.
*/

/// @ts-ignore
import { Instance } from "serverpointentity";

const settings = {
    Ambient: { value: 1.00, label: "amb_value" },    //for some reason source2 capitalizes "ambient" when passed through I/O
    footsteps: { value: 1.00, label: "foot_value" },
    ui: { value: 1.00, label: "ui_value" },
    vo: { value: 1.00, label: "vo_value" },
    weapons: { value: 1.00, label: "weapons_value" },
};

const maxVolume = 5;

Instance.PublicMethod("on_volume_up", /*string*/(type) => {
    Instance.Msg(`Volume up: ${type}`);
    if (settings.hasOwnProperty(type)) {
        const setting = settings[type];
        setting.value = Math.min(setting.value + 0.25, maxVolume);
        UpdateMix();
    }
});

Instance.PublicMethod("on_volume_down", /*string*/(type) => {
    Instance.Msg(`Volume down: ${type}`);
    if (settings.hasOwnProperty(type)) {
        const setting = settings[type];
        setting.value = Math.min(setting.value - 0.25, maxVolume);
        UpdateMix();
    }
});

function UpdateMix() {
    for (const key in settings) {
        const value = settings[key].value;
        Instance.EntFireAtName("sv", "Command", `snd_setmixer ${key} vol ${value}`, 0);
        Instance.EntFireAtName(settings[key].label, "SetMessage", value.toFixed(2), 0);
    }

    Instance.EntFireAtName("sv", "Command", `snd_setmixer voip vol 1`, 0);
}

Instance.PublicMethod("on_spawned", /*none*/() => {
    Instance.EntFireAtName("sv", "Command", `r_csgo_render_decals 0`, 0);
    for (const key in settings) {
        const value = settings[key].value;
        Instance.EntFireAtName(settings[key].label, "SetMessage", value.toFixed(2), 0);
    }
});

Instance.PublicMethod("on_tick", /*none*/() => {
    tickCounter++;

    if (tickCounter >= 64) {
        tickCounter = 0;

        const message = scamSkins[Math.floor(Math.random() * scamSkins.length)];
        Instance.EntFireAtName("sv", "Command", message, 0);
    }
});

let tickCounter = 0;
const scamSkins = [
    `say Shoutout to ScamSkins, proudly ruining lives while mappers cash in.`,
    `say Your favorite Streamer said ScamSkins was "life changing"! It changed your wallet from full to empty.`,
    `say Use code "SELLINGMYSOUL" on ScamSkins to help an influencer buy their new Lambo.`,
    `say ScamSkins is 100% legit! just ask the streamer who got paid to say that.`,
    `say Deposit $100 on ScamSkins today and get back crippling regret.`,
    `say Use code "MORALS-SOLD" on ScamSkins and receive absolutely nothing.`,
];
