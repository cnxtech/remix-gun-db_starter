import { useState, useEffect } from "react";
import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";


export let loader: LoaderFunction = () => {
  let data = {}
  return json(data) ;
};

export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!"
  };
};

export default function Index() {

  return (
    <div className="remix__page">
      <main>
       
      </main>
      <aside>
       
      </aside>
    </div>
  );
}
