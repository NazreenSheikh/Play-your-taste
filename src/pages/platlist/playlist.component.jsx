import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import PlayBar from '../../components/playbar/playbar.component'
import Spinner from '../../components/spinner/spinner.component'
import { useHttpClient } from '../../hooks/HttpClient'
import defaultImg from '../../assets/default.svg'

import './playlist.styles.css'

const PlaylistPage = () => {
  const { key } = useParams()
  const linkData = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [playPause, setPlayPause] = useState({
    show: {},
  })

  const { error, sendRequest } = useHttpClient()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await sendRequest(
        linkData.state.url,
        linkData.state.urlParams,
        linkData.state.host,
      )

      if (Object.keys(result).length !== 0 || !result || error) {
        setIsError(null)

        if (linkData.state.song) {
          let filterData = []
          result.tracks.hits.forEach((list, index) =>
            filterData.push(list.track),
          )

          setPlaylist(filterData)
        } else {
          setPlaylist(result)
        }
      } else {
        setIsError('NO search found. Try something different.')
      }
      setIsLoading(false)
    }

    if (linkData.state) {
      fetchData()
    }
  }, [linkData])

  const togglePlayPause = (panel) => {
    const newState = {
      show: {
        [panel]: !playPause.show[panel],
      },
    }

    setPlayPause(newState)
  }

  return (
    <>
      {!linkData.state || isError ? (
        <div className="muxic__song-exception__handling">
          <div>{isError ? isError : 'Nothing here'}</div>
        </div>
      ) : (
        <div className="muxic__song-result__container">
          <div className="muxic__song-result__container_homelink">
            <Link to="/">Go Home</Link>
          </div>
          {!isLoading ? (
            playlist ? (
              <div className="muxic__song-result__container__playlist-box">
                <p className="muxic__song-result__container__playlist-box_showing">
                  Showing results for <span> {key} </span>
                </p>
                {playlist.map((play, index) => (
                  <PlayBar
                    title={play.title}
                    subtitle={play.subtitle}
                    img={play.images ? play.images.coverart : defaultImg}
                    key={play.title + index}
                    playNo={index + 1}
                    audio={play.hub ? play.hub.actions[1].uri : null}
                    togglePlay={togglePlayPause}
                    playPause={playPause.show}
                  />
                ))}
              </div>
            ) : null
          ) : (
            <Spinner />
          )}
        </div>
      )}
    </>
  )
}

export default PlaylistPage
