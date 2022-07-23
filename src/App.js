import { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import useFfmpeg from "./useFfmpeg";

// https://github.com/ffmpegwasm/ffmpeg.wasm/issues/263

function App() {
  const [videoSrc, setVideoSrc] = useState("");
  const [inputVideoSrc, setInputVideoSrc] = useState("");
  const [trimmedVideoSrc, setTrimmedVideoSrc] = useState("");
  const { getTrimmedVideo } = useFfmpeg();

  // const trimStartTime = document.getElementsByName("trim-start")[0].value;
  // const trimEndTime = document.getElementsByName("trim-end")[0].value;

  const onChangeInput = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    setInputVideoSrc(url);
    setVideoSrc(url);

    // await doTranscode();
  };

  // https://www.codegrepper.com/code-examples/shell/ffmpeg+convert+mp4+to+mp4
  // codec을 변경하거나
  // 동영상의 사이즈를 변경하거나

  const handleClickTrimButton = async () => {
    const objectUrl = await getTrimmedVideo(videoSrc, 0, 10);
    console.log(objectUrl, "result?");

    setTrimmedVideoSrc(objectUrl);
  };

  return (
    <div className="App">
      <h2>video input</h2>
      <input type="file" onChange={onChangeInput} name="video-file" />
      <h2>input video</h2>
      <video src={inputVideoSrc} controls width="300px" id="input-video" />
      {/* <h2>transcoded video</h2> */}
      {/* <video src={videoSrc} controls width="300px" id="transcoded-video" /> */}
      {/* <br /> */}
      <h2>trimmed video</h2>
      <h3>구간</h3>
      <input type="number" name="trim-start" placeholder="0" />
      ~
      <input
        type="number"
        name="trim-end"
        placeholder="0"
        // max={videoDuration}
      />
      <button onClick={handleClickTrimButton}>Trim Video</button>
      <h3>결과</h3>
      <video src={trimmedVideoSrc} controls width="300px" id="trimmed-video" />
    </div>
  );
}

export default App;

// https://lts0606.tistory.com/510
// https://github.com/ffmpegwasm/ffmpeg.wasm/issues/322
