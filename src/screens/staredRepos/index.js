import React, { useEffect, useState } from "react";
import "./style.css";
import moment from "moment";

const HomeScreen = () => {
  const [getRepoData, setGetRepoData] = useState([]);
  useEffect(() => {
    setGetRepoData(JSON.parse(localStorage.getItem("favs")));
  }, []);

  return (
    <div className="mainContainer">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeScreen;
