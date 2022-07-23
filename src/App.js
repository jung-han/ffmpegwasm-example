import { useState } from "react";
import useFfmpeg from "./useFfmpeg";

// https://github.com/ffmpegwasm/ffmpeg.wasm/issues/263

function App() {
  const [videoSrc, setVideoSrc] = useState("");
  const [inputVideoSrc, setInputVideoSrc] = useState("");
  const [trimmedVideoSrc, setTrimmedVideoSrc] = useState("");
  const [thumbnailList, setThumbnailList] = useState([]);
  const { getTrimmedVideo, makeThumbnail } = useFfmpeg();

  const onChangeInput = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    setInputVideoSrc(url);
    setVideoSrc(url);
  };

  // https://www.codegrepper.com/code-examples/shell/ffmpeg+convert+mp4+to+mp4
  // codec을 변경하거나
  // 동영상의 사이즈를 변경하거나

  const handleClickTrimButton = async () => {
    const trimStartTime = document.getElementsByName("trim-start")[0].value;
    const trimEndTime = document.getElementsByName("trim-end")[0].value;
    const objectUrl = await getTrimmedVideo(videoSrc, trimStartTime, trimEndTime);

    setTrimmedVideoSrc(objectUrl);
  };

  const handleClickThumbnailButton = async () => {
    const thumbnailList = [];
    const objectUrl = await makeThumbnail(videoSrc, 4);

    thumbnailList.push(objectUrl);

    setThumbnailList(thumbnailList);
  };

  return (
    <div className="App">
      <h2>video input</h2>
      <input type="file" onChange={onChangeInput} name="video-file" />
      <h2>input video</h2>
      <video src={inputVideoSrc} controls width="300px" id="input-video" />
      <h2>trimmed video</h2>
      <h3>구간</h3>
      <input type="number" name="trim-start" placeholder="0" />
      ~
      <input type="number" name="trim-end" placeholder="0" />
      <button onClick={handleClickTrimButton}>비디오 자르기</button>
      <h3>결과</h3>
      <video src={trimmedVideoSrc} controls width="300px" id="trimmed-video" />
      <h2>make thumbnail</h2>
      <button onClick={handleClickThumbnailButton}>만들기</button>
      {thumbnailList.map((thumbnailImage) => (
        <img src={thumbnailImage} width="150px" key={thumbnailImage} />
      ))}
    </div>
  );
}

export default App;

// https://lts0606.tistory.com/510
// https://github.com/ffmpegwasm/ffmpeg.wasm/issues/322
