import { useState, useEffect } from "react";
import { getAltitude, getAzimuth } from "./RaDecAltAz";

const BACKEND_URL = "http://127.0.0.1:8000";
//import * as altaz from './RaDecAltAz.js';

// let coordinates = [
//   { id: 0, type: 'ra' },
//   { id: 1, type: 'dec' }
// ];

// interface RightAscension {hours: int, minutes:int, seconds: int};

const initialValues = {
  ra: 0,
  dec: 0,
  alt: getAltitude(0, 0),
  az: getAzimuth(0, 0),
};

function updateAltAz(request) {
  let r = request;
  r.alt = getAltitude(request.ra, request.dec);
  r.az = getAzimuth(request.ra, request.dec);
  return r;
}

function MyForm() {

  // TODO: response Validation
  // TODO: multiple data types (float, minutes hours seconds)
  const [responseBody, setResponseBody] = useState(initialValues);

  const [sentRequest, setRequest] = useState(null);

  const [realValues, setRealValues] = useState(initialValues);

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setResponseBody({ ...responseBody, [name]: value });
  };

  const updateState = (e) => {
    e.preventDefault();
    if (sentRequest) {
      console.log("Request already made");
    } else {
      const r = updateAltAz(responseBody);
      setRequest(r);
      console.log(sentRequest);
    }
    // TODO: send request to RT API}

    return;
    // const newArray = coord.map((item, i) => {
    //   if (index === i) {
    //     /// target is the new changed values
    //     return { ...item, [e.target.name]: e.target.value };
    //   } else {
    //     return item;
    //   }
    // });
    // console.log(index, e.target.name, e.target.value);
    // setCoord(newArray);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Checking" + sentRequest);
      if (sentRequest != null) {
        setRealValues(sentRequest);
        console.log(JSON.stringify(sentRequest));
        fetch(BACKEND_URL + "/request_coordinates", {
          method: "POST",
          body: JSON.stringify({ alt: sentRequest.alt, az: sentRequest.az }),
          headers: {
            "Content-type": "application/json;",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Successfully sent request");
            console.log(data);
            // Handle data
          })
          .catch((err) => {
            console.log(err.message);
          });
        setRequest(null);

        console.log("Set request");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [sentRequest]);
  function RequestState() {
    if (sentRequest != null) {
      console.log("hi" + sentRequest.toString());
      console.log(sentRequest);
      return (
        <div>
          <h3>Processing Request!</h3>
          <div>
            <li>RA: {sentRequest.ra}</li>
            <li>DEC: {sentRequest.dec}</li>
            <li>alt: {sentRequest.alt}</li>
            <li>az: {sentRequest.az}</li>
          </div>
        </div>
      );
    } else {
      console.log("request n ull");
    }
  }
  return (
    <>
      {/* {coord.map((datum, index) => 
        <li key={datum.type}>
          <input
            type="text"
            name="name"
            value={datum.type}
            onChange={updateState(index)}
          />
        </li>
    )} */}

      <div>
        <h1>Current Values</h1>
        <li>RA: {realValues.ra}</li>
        <li>DEC: {realValues.dec}</li>
        <li>alt: {realValues.alt}</li>
        <li>az: {realValues.az}</li>
      </div>
      <RequestState />
      <form onSubmit={updateState}>
        <label>
          Enter Right Ascention
          <br />
          <input type="text" name="ra" onChange={inputChangeHandler} />
        </label>
        <br />
        <label>
          Enter Declination
          <br />
          <input type="text" name="dec" onChange={inputChangeHandler} />
        </label>
        <br />
        <input type="submit" />
      </form>
    </>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app!</h1>
      <MyForm />
    </div>
  );
}
