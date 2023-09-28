
import { useState } from 'react';
//import * as altaz from './RaDecAltAz.js';

let coordinates = [
  { id: 0, type: 'ra' },
  { id: 1, type: 'dec' }
];

function MyForm() {
  const [coord, setCoord] = useState(coordinates)
  const [input, setInput] = useState("");

  const updateState = (index) => (e) => {
    const newArray = coord.map((item, i) => {
      if (index === i) {
        return { ...item, [e.target.name]: e.target.value };
      } else {
        return item;
      }
    });
    setCoord(newArray);
  };
  return (
    <>
    {coord.map((datum, index) => {
        <li key={datum.name}>
          <input
            type="text"
            name="name"
            value={datum.name}
            onChange={updateState(index)}
          />
        </li>;
        })}
      <form onSubmit={(event) => event.preventDefault()}>
        <label>Enter Right Ascention<br />
          <input
            type="text"
            name="ra"
            onChange={saveInput}
          />
        </label>
        <br />
        <label>Enter Declination<br />
          <input
            type="text"
            name="dec"
            onChange={saveInput}
          />
        </label>
        <br />
        <button type='Submit' onClick={updateState()}
        >Submit</button>
      </form>

    </>
  )
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app!</h1>
      <MyForm />
    </div>
  );
}
