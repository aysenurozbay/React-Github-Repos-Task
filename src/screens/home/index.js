import axios from "axios";
import React, { useState } from "react";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";

import "./style.css";

import { BsHeart, BsHeartFill } from "react-icons/bs";

const HomeScreen = () => {
  const [text, setText] = useState("");
  const [userData, setUserData] = useState([]);
  const [getRepoData, setGetRepoData] = useState([]);

  const ROOT_URL = "https://api.github.com/users/";

  const manipulateRepos = (data) => {
    const localDataArray = JSON.parse(localStorage.getItem("favs"));
    let returnData;
    if (localDataArray && localDataArray.length) {
      returnData = data.map((_data) => {
        return localDataArray.some((localItem) => {
          return _data.id === localItem.id;
        })
          ? { ..._data, isFav: true }
          : _data;
      });
    } else {
      returnData = data;
    }
    returnData.sort((a, b) => {
      return a.created_at < b.created_at
        ? 1
        : a.created_at > b.created_at
        ? -1
        : 0;
    });
    return returnData;
  };

  const getUsers = async () => {
    const USER_URL = `${ROOT_URL}${text}`;
    const REPO_URL = `${ROOT_URL}${text}/repos`;

    const user_request = axios.get(USER_URL);
    const repo_request = axios.get(REPO_URL);
    try {
      await axios.all([user_request, repo_request]).then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          setUserData(responseOne.data);
          const finalData = manipulateRepos(responseTwo.data);
          setGetRepoData(finalData);
        })
      );
      console.log(userData);
    } catch (err) {
      console.error(err);
    }
  };

  const addToFavorite = (repo) => {
    let localData = localStorage.getItem("favs");
    const parsedLocalData = JSON.parse(localData);
    let dataWithFav;
    if (repo.isFav) {
      const data = [...parsedLocalData];
      const index = data.findIndex((data) => data.id === repo.id);
      data.splice(index, 1);
      localStorage.setItem("favs", JSON.stringify([...data]));

      dataWithFav = getRepoData.map((data) => {
        if (data.id === repo.id) {
          delete data.isFav;
        }
        return { ...data };
      });
    } else {
      const {
        id,
        name,
        html_url,
        language,
        created_at,
        owner: { login },
      } = repo;

      const data = {
        id,
        name,
        html_url,
        language,
        created_at,
        userName: login,
      };

      if (localData && parsedLocalData.length) {
        const repoExist = parsedLocalData.find((data) => data.id === id);

        if (!repoExist) {
          const newArray = parsedLocalData;
          newArray.push(data);
          localStorage.setItem("favs", JSON.stringify([...newArray]));
        }
      } else {
        localStorage.setItem("favs", JSON.stringify([data]));
      }

      dataWithFav = getRepoData.map((data) => {
        if (data.id === id) {
          return { ...data, isFav: true };
        }
        return { ...data };
      });
    }
    setGetRepoData(dataWithFav);
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (value) => {
    value.preventDefault();
    getUsers();
  };

  return (
    <div className="mainContainer">
      <form onSubmit={handleSubmit} className="formMain">
        <label className="inputTitle">
          Username:
          <input
            type="text"
            className="input"
            value={text}
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="Submit" className="submitButton" />
      </form>

      <div className="infoContainer">
        <img
          src={userData.avatar_url}
          alt={userData.name}
          className="userImage"
        />

        <div className="detailContainer">
          <h5>{userData.name}</h5>
          <h6>
            {userData.location} {userData.company}
          </h6>
          <h6>
            Followers: {userData.followers} Following: {userData.following}
          </h6>
        </div>
      </div>
      <table className="zigzag">
        <thead>
          <tr>
            <th className="header">Repo Name</th>
            <th className="header">Created At</th>
            <th className="header">URL</th>
            <th className="header">Language</th>
            <th className="header" style={{ backgroundColor: "#fff" }}></th>
          </tr>
        </thead>
        <tbody>
          {getRepoData.map((repo) => (
            <tr>
              <td>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  {repo.name}
                </a>
              </td>
              <td>{moment(repo.created_at).format("DD-MM-YYYY")}</td>
              <td>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  {repo.html_url}
                </a>
              </td>
              <td>{repo.language}</td>

              <td>
                <button
                  onClick={() => addToFavorite(repo)}
                  style={{
                    height: "50px",
                    color: "#d62828",
                    border: "none",
                    backgroundColor: "#fff",
                  }}
                >
                  {repo.isFav ? <BsHeartFill /> : <BsHeart />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeScreen;
