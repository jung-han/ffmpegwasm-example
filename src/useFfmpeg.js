import { useEffect, useRef } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const formatTimeHHMMSS = (sec) => {
  const date = new Date(0);
  date.setSeconds(sec);

  return date.toISOString().substr(11, 8);
};

const useFfmpeg = () => {
  const ffmpegRef = useRef(createFFmpeg({ log: true }));

  const loadFfmpeg = async () => {
    await ffmpegRef.current.load();
  };

  useEffect(() => {
    if (!ffmpegRef.current.isLoaded()) {
      loadFfmpeg();
    }
  }, []);

  const getTrimmedVideo = async (videoSrc, startTime = 0, endTime = 0) => {
    if (!videoSrc.length) {
      console.log("비디오가 존재하지 않습니다!");
      return;
    }

    const ffmpeg = ffmpegRef.current;
    const formattedStartTime = formatTimeHHMMSS(startTime);
    const formattedEndTime = formatTimeHHMMSS(endTime);

    const name = "test.mp4";
    const outputName = "output.mp4";
    ffmpeg.FS("writeFile", name, await fetchFile(videoSrc));

    // https://stackoverflow.com/questions/18444194/cutting-the-videos-based-on-start-and-end-time-using-ffmpeg
    await ffmpeg.run(
      "-ss",
      formattedStartTime,
      "-to",
      formattedEndTime,
      "-i",
      name,
      "-c:v",
      "copy",
      "-c:a",
      "copy",
      outputName,
    );

    const data = await ffmpeg.FS("readFile", outputName);
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

  const makeThumbnail = async (videoSrc, time) => {
    if (!videoSrc.length) {
      console.log("비디오가 존재하지 않습니다!");
      return;
    }

    const ffmpeg = ffmpegRef.current;
    const name = "test.mp4";
    ffmpeg.FS("writeFile", name, await fetchFile(videoSrc));

    // ! parallel하게 돌지 않는다.
    // https://stackoverflow.com/questions/10957412/fastest-way-to-extract-frames-using-ffmpeg
    const outputName = `output_${time}.bmp`;
    await ffmpeg.run("-i", name, "-ss", `${time}`, "-r", "1/1", outputName);
    const data = await ffmpeg.FS("readFile", outputName);

    return URL.createObjectURL(new Blob([data.buffer], { type: "image/bmp" }));
  };

  return {
    getTrimmedVideo,
    makeThumbnail,
  };
};

export default useFfmpeg;
