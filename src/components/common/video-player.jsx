import React, { Component, PropTypes } from 'react';

class VideoPlayer extends(Component) {
  static propTypes = {
    nowPlaying: PropTypes.object.isRequired,
    poster: PropTypes.string,
    aspect_ratio: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
  }

  render() {
    let { nowPlaying, poster, aspect_ratio, width, height } = this.props;

    let sources = [nowPlaying.video_file];

    if (!width) {
      width = 640;
    }

    if (!height) {
      height = 360;
    }

    if (!aspect_ratio) {
      aspect_ratio = "16:9";
    }

    return (
      <video autoplay id={`video-player-${nowPlaying.id}`} class="video-js vjs-default-skin"
        width={width} height={height}
        controls preload="none" poster={poster}
        data-setup={`{ "autoplay": true, "preload": true, "aspectRatio":${aspect_ratio}, "playbackRates": [1, 1.5, 2], "loop": true, }`}>
        {sources.map((source, idx) =>
          <source
            src={source}
            type='video/mp4' key={idx} />
        )}
      </video>
    );
  }
}

export default VideoPlayer;
