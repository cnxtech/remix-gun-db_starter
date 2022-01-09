import React from "react";
import { gun } from "~/lib/GunDb";

const initialState = {
  components: [],
};

// Create a reducer that will update the components array
function reducer(state: any, component: any) {
  return {
    components: [component, ...state.components],
  };
}
export default function Wee() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  let wee = gun.get('set2');
  React.useEffect(() => {
    wee.map().once((a: any) => {
      dispatch({
        hello: a.hello,
        params: a.params,
      });
    });
  });
  return (
    <ul>
      {state.components.map((comp: any) => {
        <li key={comp.hello}>
          <h1>Hello</h1>
          <p>{comp.hello}</p>
          <h1>Params</h1>
          <p>{comp.params}</p>
        </li>;
      })}
    </ul>
  );
};
