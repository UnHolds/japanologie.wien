"use client";

import Link from "next/link";
import { api_key_exists, Assignment, get_assignments } from "./_api/api";
import { useEffect, useState } from "react";
export default function WaniKani() {
  const [_assignments, _setAssignments] = useState<Assignment[]>([]);
  const [_apiKeyExists, _setApiKeyExists] = useState(false);

  useEffect(() => {
    get_assignments()
      .then((r) => _setAssignments(r))
      .catch(() => _setAssignments([]));
    _setApiKeyExists(api_key_exists());
  }, []);

  return (
    <div className="h-full">
      <div className="flex h-full justify-center items-center">
        <div>
          <div className="text-center md:text-7xl text-4xl font-bold">
            WaniKani
          </div>
          {_apiKeyExists == false && (
            <h3 className="text-red-500 text-center text-bold text-xl">
              API-KEY is missing, please add it in the settings
            </h3>
          )}
          <div className="my-15 flex gap-5 md:flex-row flex-col mx-6">
            <Link
              className="flex bg-sky-700 p-4 rounded md:text-4xl text-2xl font-bold items-center"
              href="/wanikani/review"
            >
              Reviews ({_assignments.length})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
