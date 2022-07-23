import { useEffect, useRef } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const useFfmpeg = () => {
  const ffmpeg = useRef(createFFmpeg({ log: true }));

  const loadFfmpeg = async () => {
    await ffmpeg.current.load();
  };

  useEffect(() => {
    if (!ffmpeg.current.isLoaded()) {
      loadFfmpeg();
    }
  }, []);

  const getTrimmedVideo = async (videoSrc, startTime, endTime) => {
    if (!videoSrc.length) {
      console.log("비디오가 존재하지 않습니다!");
      return;
    }

    const name = "test.mp4";
    const outputName = "output.mp4";
    ffmpeg.current.FS("writeFile", name, await fetchFile(videoSrc));

    // https://stackoverflow.com/questions/18444194/cutting-the-videos-based-on-start-and-end-time-using-ffmpeg
    await ffmpeg.current.run(
      "-ss",
      "00:00:00", // 순서에 영향을 받네?
      "-i",
      name,
      "-to",
      "00:00:10",
      "-c:v",
      "copy",
      "-c:a",
      "copy",
      outputName
    );

    const data = await ffmpeg.current.FS("readFile", outputName);
    return URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
  };

  //   const doTranscode = async () => {
  //     if (!ffmpeg.isLoaded()) {
  //       setMessage("Loading ffmpeg-core.js");
  //       await ffmpeg.load();
  //     }

  //     setMessage("Start transcoding");
  //     ffmpeg.FS("writeFile", "test.mp4", await fetchFile(inputVideoSrc));

  //     await ffmpeg.run("-i", "test.mp4", "trans.mp4");
  //     setMessage("Complete transcoding");

  //     // https://opensource.com/article/17/6/ffmpeg-convert-media-file-formats
  //     // codec?
  //     // ffmpeg -i broken.mp4 -pix_fmt yuv420p -crf 18 good.mp4

  //     // "setpts=0" 의 의미?
  //     // https://stackoverflow.com/questions/43333542/what-is-video-timescale-timebase-or-timestamp-in-ffmpeg

  //     const data = ffmpeg.FS("readFile", "trans.mp4");
  //     setVideoSrc(
  //       URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
  //     );
  //   };

  return {
    ffmpeg,
    getTrimmedVideo,
  };
};

export default useFfmpeg;
