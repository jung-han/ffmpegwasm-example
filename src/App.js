import { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

// https://github.com/ffmpegwasm/ffmpeg.wasm/issues/263

function App() {
  const [videoSrc, setVideoSrc] = useState("");
  const [inputVideoSrc, setInputVideoSrc] = useState("");
  const [trimmedVideoSrc, setTrimmedVideoSrc] = useState("");
  const [message, setMessage] = useState("Click Start to transcode");

  const ffmpeg = createFFmpeg({ log: true });

  // 트랜스코딩. 다른 확장자로 변경
  const doTranscode = async () => {
    if (!ffmpeg.isLoaded()) {
      setMessage("Loading ffmpeg-core.js");
      await ffmpeg.load();
    }

    setMessage("Start transcoding");
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(inputVideoSrc));

    await ffmpeg.run("-i", "test.mp4", "trans.mp4");
    setMessage("Complete transcoding");

    // https://opensource.com/article/17/6/ffmpeg-convert-media-file-formats
    // codec?
    // ffmpeg -i broken.mp4 -pix_fmt yuv420p -crf 18 good.mp4

    // "setpts=0" 의 의미?
    // https://stackoverflow.com/questions/43333542/what-is-video-timescale-timebase-or-timestamp-in-ffmpeg

    const data = ffmpeg.FS("readFile", "trans.mp4");
    setVideoSrc(
      URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    );
  };

  // 영상 커팅
  const trimVideo = async () => {
    const trimStartTime = document.getElementsByName("trim-start")[0].value;
    const trimEndTime = document.getElementsByName("trim-end")[0].value;

    console.log(trimStartTime, trimEndTime);

    if (!videoSrc.length) {
      console.log("비디오가 존재하지 않습니다!");
      return;
    }

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const name = "test.mp4";
    const outputName = "output.mp4";
    ffmpeg.FS("writeFile", name, await fetchFile(videoSrc));

    // https://stackoverflow.com/questions/18444194/cutting-the-videos-based-on-start-and-end-time-using-ffmpeg
    await ffmpeg.run(
      "-i",
      name,
      "-ss",
      "00:00:03", // 영상마다 앞에 생기는 불필요한 frame들의 시간이 다르다..
      "-t",
      "00:00:10",
      // "setpts=0",
      "-c:v",
      "copy",
      "-c:a",
      "copy",
      outputName
    );

    const data = await ffmpeg.FS("readFile", outputName);
    const objectUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    setTrimmedVideoSrc(objectUrl);
  };

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

  return (
    <div className="App">
      <h2>video input</h2>
      <input type="file" onChange={onChangeInput} name="video-file" />
      <h2>input video</h2>
      <video src={inputVideoSrc} controls width="300px" id="input-video" />
      {message}
      <h2>transcoded video</h2>
      <video src={videoSrc} controls width="300px" id="transcoded-video" />
      <br />
      <h2>trimmed video</h2>
      <h3>구간</h3>
      <input type="number" name="trim-start" placeholder="0" />
      ~
      <input type="number" name="trim-end" placeholder="0" />
      <button onClick={trimVideo}>Trim Video</button>
      <h3>결과</h3>
      <video src={trimmedVideoSrc} controls width="300px" id="trimmed-video" />
    </div>
  );
}

export default App;

// https://lts0606.tistory.com/510
// https://github.com/ffmpegwasm/ffmpeg.wasm/issues/322
