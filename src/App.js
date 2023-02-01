import React, { useCallback, useEffect, useMemo, useState } from "react";

import { BsFillCalendarEventFill } from "react-icons/bs";
import { AiOutlineYoutube } from "react-icons/ai";
import { ImWikipedia } from "react-icons/im";
import { SiNasa } from "react-icons/si";
import { GrFormClose } from "react-icons/gr";

import { AllLanches } from "./components/LaunchTypes";
import { StickyHeadTable } from "./components/DataTable";
import "./App.css";

const Modal = (props) => {
  const { onClose, launchers, id } = props;
  const flightData = useMemo(
    () =>
      launchers.find((number) => {
        return number.flight_number === id;
      }),
    [launchers, id]
  );

  return (
    <div className="modal-main-overlay">
      <div className="modal-main">
        <div className="close-button">
          <button onClick={() => onClose()} className="closeButton">
            <GrFormClose />
          </button>
        </div>
        <div className="launchDetailsHeader ">
          <div>
            <img
              className="rocket"
              alt="not loaded"
              src={flightData.links.mission_patch_small}
            />
          </div>
          <div className="rocketType">
            <span className="mission">{flightData.mission_name}</span>
            <span>{flightData.rocket.rocket_name}</span>
            <span>
              <a href={flightData.links.wikipedia}>
                <ImWikipedia />
              </a>
              <a href={flightData.links.video_link} className="youTubeIcon">
                <AiOutlineYoutube />
              </a>
              <a href={flightData.links.article_link}>
                <SiNasa />
              </a>
            </span>
          </div>
          <div
            className={`status ${
              flightData.launch_success ? "success" : "failure"
            }`}
          >
            <span>{flightData.launch_success ? "Success" : "Failure"}</span>
          </div>
        </div>
        <div className="wikipedie">
          <p className="wikipediedetails">
            {flightData.details}
            <a href={flightData.links.wikipedia} style={{ marginLeft: "5px" }}>
              Wikipedia
            </a>
          </p>
        </div>
        <hr />
        <ul>
          <li className="footer">
            <span>Flight Number</span>
            <span>{flightData.flight_number}</span>
          </li>
          <li className="footer">
            <span>Mission Name</span>
            <span>{flightData.mission_name}</span>
          </li>
          <li className="footer">
            <span>Rocket Type</span>
            <span>{flightData.rocket.rocket_type}</span>
          </li>
          <li className="footer">
            <span>Rocket Name</span>
            <span>{flightData.rocket.rocket_type}</span>
          </li>
          <li className="footer">
            <span>Manufacturer</span>
            <span>{flightData.rocket.second_stage.payloads.manufacturer}</span>
          </li>
          <li className="footer">
            <span>Nationality</span>
            <span>{flightData.rocket.second_stage.payloads.nationality}</span>
          </li>
          <li className="footer">
            <span>launch Date local</span>
            <span>{flightData.launch_date_local}</span>
          </li>
          <li className="footer">
            <span>payload Type</span>
            <span>{flightData.rocket.second_stage.payloads.payload_type}</span>
          </li>
          <li className="footer">
            <span>Orbit</span>
            <span>{flightData.rocket.second_stage.payloads.orbit}</span>
          </li>
          <li className="footer">
            <span>Launch Site</span>
            <span>{flightData.launch_site.site_name}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  const [LaunchesDetails, setLaunchesDetails] = useState([]); // State to save the formatted the launcher details.
  const [isLoaded, setIsLoaded] = useState(false); // State to show loader
  const [launchers, setLaunchers] = useState([]); // State to handle the api data and store through
  const [selectedLaunches, setSelectedLaunches] = useState(() => {
    const storedType = localStorage.getItem("type");
    if (storedType) return storedType;
    return "all";
  }); // State to handle the dropdown value (type of launches)
  const [err, setErr] = useState(null); // State to see if there is any error on api fething
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12); // State of manage the count the number of items per page
  const [isShow, setIsShow] = useState(false); // State to handle the modal to show or not

  const filteredLaunches = useCallback((value, data) => {
    if (data.length < 1) return;
    const filterValue = data.filter((item) => {
      return String(item.launch_success) === value;
    });
    updateLuncherdetailsStatus(filterValue);
  }, []);

  useEffect(() => {
    localStorage.setItem("type", selectedLaunches);
    const getLaunchesData = async (type = "") => {
      setIsLoaded(true);

      // Handle the URL depends on the selected Input.
      let api_url = `https://api.spacexdata.com/v3/launches`;
      if (["upcoming", "past"].includes(type)) {
        api_url = `https://api.spacexdata.com/v3/launches/${type}`;
      }

      try {
        const response = await fetch(api_url);
        const data = await response.json();
        setLaunchers(data);
        // If the selected value is upcoming or all or anything we fetch data and directly update the state
        if (["upcoming", "past", "all"].includes(type)) {
          updateLuncherdetailsStatus(data);
        } else {
          // If the selected filter is failure or success, we filter through the data based on the selected values
          filteredLaunches(type, data);
        }
        setIsLoaded(false);
      } catch (e) {
        setErr(e);
        setIsLoaded(false);
      }
    };
    getLaunchesData(selectedLaunches);
  }, [selectedLaunches, filteredLaunches]);

  const onClose = () => {
    setIsShow(false);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  };

  function updateLuncherdetailsStatus(lunchersStatus) {
    const updatedData = lunchersStatus.map((each) => ({
      No: each.flight_number,
      Launched: each.launch_date_utc,
      Location: each.launch_site.site_name,
      Mission: each.mission_name,
      Orbit: each.rocket.second_stage.payloads?.[0].orbit,
      LaunchedStatus: each.launch_success ? "Success" : "Failure",
      Rocket: each.rocket.rocket_name,
    }));

    setLaunchesDetails(updatedData);
  }

  function SelectTime() {
    return (
      <div>
        <BsFillCalendarEventFill style={{ marginRight: 10 }} />
        <select
          className="dropdown"
          value={selectedLaunches}
          onChange={(e) => setSelectedLaunches(e.target.value)}
        >
          <option disabled>Select</option>
          <option value="">Last 6 Months</option>
          <option value="past">Past 6 Months</option>
        </select>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <img
          alt="timer"
          src={require("./images/spacex.png")}
          className="spaceX-image"
        />
      </div>

      <div className="section">
        <div className="dashboard">
          <div className="dashboardheader">
            <SelectTime />
            <AllLanches
              onChange={(e) => setSelectedLaunches(e.target.value)}
              value={selectedLaunches}
            />
          </div>
          <div className="dashbordSection">
            <StickyHeadTable
              LaunchesDetails={LaunchesDetails}
              err={err}
              isLoaded={isLoaded}
              rowsPerPage={rowsPerPage}
              page={page}
              onRowClick={(rowNumber) => {
                setIsShow(rowNumber);
              }}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
        </div>
        {isShow && (
          <Modal onClose={onClose} id={isShow} launchers={launchers} />
        )}
      </div>
    </div>
  );
}

export default App;
