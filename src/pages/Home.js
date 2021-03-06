import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { Logo } from "../images/Netflix";
import {
  ConnectButton,
  Icon,
  TabList,
  Tab,
  Button,
  Modal,
  useNotification,
} from "web3uikit";
import { movies } from "../helpers/library";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
const Home = () => {
  const [visible, setVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState();
  const { isAuthenticated, Moralis, account } = useMoralis();

  const [mymovies, setMymovies] = useState();

  useEffect(() => {
    async function fetchMylist() {
      try {
        const theList = await Moralis.Cloud.run("getMyList", {
          addrs: account,
        });
        const filterA = movies.filter(function (e) {
          return theList.indexOf(e.Name) > -1;
        });
        setMymovies(filterA);
      } catch (error) {
        console.error();
      }
    }
    fetchMylist();
  }, [account]);

  const dispatch = useNotification();

  const handleNewNotification = () => {
    dispatch({
      type: "error",
      message: "Please connect your Crypto Wallet",
      title: "Not Anthenticated",
      position: "topL",
    });
  };

  const handleAddNotification = () => {
    dispatch({
      type: "success",
      message: "Movie Added to List",
      title: "Success",
      position: "topL",
    });
  };

  return (
    <>
      <div className="logo">
        <Logo />
      </div>
      <div className="connect">
        <Icon fill="#ffffff" size={24} svg="bell" />
        <ConnectButton />
      </div>
      <div className="topBanner">
        <TabList defaultActiveKey={1} isVertical={false} tabStyle="bar">
          <Tab tabKey={1} tabName={"Movies"}>
            <div className="scene">
              <img className="sceneImg" alt="" src={movies[0].Scene}></img>
              <img className="sceneLogo" alt="" src={movies[0].Logo}></img>
              <p className="sceneDesc">{movies[0].Description}</p>
              <div className="playButton">
                <Button
                  icon="chevronRightX2"
                  text="Play"
                  theme="secondary"
                  type="button"
                />
                <Button
                  icon="plus"
                  text="Add to my List"
                  theme="translucent"
                  type="button"
                  onClick={() => console.log(mymovies)}
                />
              </div>
            </div>
            <div className="title">Movies</div>
            <div className="thumbs">
              {movies &&
                movies.map((e) => {
                  return (
                    <img
                      key={e.Thumbnail}
                      alt=""
                      src={e.Thumbnail}
                      className="thumbnail"
                      onClick={() => {
                        setSelectedFilm(e);
                        setVisible(true);
                      }}
                    />
                  );
                })}
            </div>
          </Tab>
          <Tab tabKey={2} tabName={"Series"} isDisabled={true}></Tab>
          <Tab tabKey={3} tabName={"MyList"}>

          <div className="ownListContent">
            <div className="mylistT">
                Your Library
            </div>
            {mymovies && isAuthenticated ? (
              <>
               <div className="ownThumbs">
              {
                mymovies.map((e) => {
                  return (
                    <img
                      key={e.Thumbnail}
                      alt=""
                      src={e.Thumbnail}
                      className="thumbnail"
                      onClick={() => {
                        setSelectedFilm(e);
                        setVisible(true);
                      }}
                    />
                  );
                })}
            </div>
              </>

            ) : (
              <div className="ownThumbs">
                You need to authenticate to view own list
              </div>
            )
            
          }
          </div>
          </Tab>
        </TabList>
        {selectedFilm && (
          <div className="modal">
            <Modal
              onCloseButtonPressed={() => setVisible(false)}
              isVisible={visible}
              hasFooter={false}
              width="1000px"
            >
              <div className="modalContent">
                <img src={selectedFilm.Scene} className="modalImg" alt="" />
                <img src={selectedFilm.Logo} className="modalLogo" alt="" />
                <div className="ModalPlayButton">
                  {isAuthenticated ? (
                    <>
                      <Link to="/player" state={selectedFilm.Movie}>
                        <Button
                          icon="chevronRightX2"
                          text="Play"
                          theme="secondary"
                          type="button"
                        />
                      </Link>
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={async () => {
                          await Moralis.Cloud.run("updateMyList", {
                            addrs: account,
                            newFav: selectedFilm.Name,
                          });
                          handleAddNotification();
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        icon="chevronRightX2"
                        text="Play"
                        theme="secondary"
                        type="button"
                        onClick={handleNewNotification()}
                      />
                      <Button
                        icon="plus"
                        text="Add to my List"
                        theme="translucent"
                        type="button"
                        onClick={handleNewNotification()}
                      />
                    </>
                  )}
                  <div className="movieInfo">
                    <div className="description">
                      <div className="details">
                        <span>{selectedFilm.Year}</span>
                        <span>{selectedFilm.Duration}</span>
                      </div>
                      {selectedFilm.Description}
                    </div>
                    <div className="detailedInfo">
                      Genre:
                      <span className="deets">{selectedFilm.Genre}</span>
                      <br />
                      Actors:
                      <span className="deets">{selectedFilm.Actors}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
