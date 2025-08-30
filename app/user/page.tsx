
"use client"

import { FormEvent, useEffect, useState } from "react";
import { default_settings, get_settings, update_settings, UserSettings } from "./settings";
import { toast } from "react-toastify";

function save(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const formElements = e.currentTarget.elements as typeof e.currentTarget.elements & {
    username: {value: string},
    wanikani_apikey: {value: string}
  }

  const name = formElements.username.value;
  const api_key = formElements.wanikani_apikey.value;

  const settings = get_settings();
  //update
  settings.name = name;
  settings.wanikani.api_key = api_key;

  update_settings(settings);
  toast.success("Saved settings");


}

export default function User() {

  const [settings, setSettings] = useState<UserSettings>(default_settings());
  useEffect(() => {
    setSettings(get_settings())
  }, []);

  return (
    <div className="h-full">
      <div className="flex h-full justify-center items-center">
        <div>
          <div className="text-center md:text-7xl text-4xl font-bold">User - ユーザー</div>
          <form className="my-15 flex gap-5 grid grid-cols-2 mx-6" onSubmit={(e) => save(e)}>

              <label className="text-xl" htmlFor="username">Name</label>
              <input type="textbox" id="username" className="bg-white text-black" defaultValue={settings.name}></input>

              <label className="text-xl" htmlFor="wanikani_apikey">WaniKani API-Key</label>
              <input type="textbox" id="wanikani_apikey" className="bg-white text-black" defaultValue={settings.wanikani.api_key}></input>

              <button className="flex bg-sky-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center">Load</button>
              <button type="submit" className="flex bg-sky-700 p-4 rounded md:text-4xl text-2xl font-bold items-center justify-center">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
