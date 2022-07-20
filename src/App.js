import { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

function App() {
  const [videoSrc, setVideoSrc] = useState("");
  const [message, setMessage] = useState("Click Start to transcode");

  const ffmpeg = createFFmpeg({ log: true });

  // 트랜스코딩. 다른 확장자로 변경
  // const doTranscode = async () => {
  //   setMessage("Loading ffmpeg-core.js");
  //   await ffmpeg.load();
  //   setMessage("Start transcoding");
  //   ffmpeg.FS("writeFile", "test.mp4", await fetchFile("/sample.mp4"));

  //   await ffmpeg.run("-i", "test.mp4", "test.avi");
  //   setMessage("Complete transcoding");

  //   const data = ffmpeg.FS("readFile", "test.avi");
  //   setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: "video/avi" })));
  // };

  // 영상 커팅
  const trimVideo = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const name = "test.mp4";
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile("/sample.mp4"));

    // 0 ~ 10초 trim
    await ffmpeg.run("-i", name, "-ss", "0", "-to", "10", "-c", "copy", "output.mp4");

    const data = await ffmpeg.FS("readFile", "output.mp4");
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" })));
  };

  return (
    <div className="App">
      <video src={videoSrc} controls width="300px" />
      <br />
      {message}
      <br />
      <button onClick={trimVideo}>Do Transcode</button>
      <button onClick={trimVideo}>Trim Video</button>
    </div>
  );
}

export default App;

// https://lts0606.tistory.com/510
// https://github.com/ffmpegwasm/ffmpeg.wasm/issues/322
