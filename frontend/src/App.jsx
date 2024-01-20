import { Button, ButtonGroup } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import {
  ReactMediaRecorder,
  useReactMediaRecorder,
} from "react-media-recorder";
import React from "react";

export default function App() {
  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  const handleDownload = () => {
    const blob = new Blob([mediaBlobUrl], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-audio.wav";
    a.click();
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = () => {
        const formData = new FormData();
        formData.append(
          "audio",
          new Blob([recordedChunks], { type: "audio/wav" }),
          "recorded-audio.wav"
        );
        // Use fetch or Axios to send formData to your server
      };
    }
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <>
      <div className="min-h-screen p-28 flex flex-col">
        <Textarea
          value={value}
          onChange={handleInputChange}
          placeholder="Here is a sample placeholder"
          size="sm"
          resize={"none"}
        />
        <div>
          <p>{status}</p>

          <video src={mediaBlobUrl} controls autoPlay loop />
        </div>
        <Button
          onClick={startRecording}
          colorScheme="red"
          size="lg"
          isLoading={isLoading}
          padding={10}
          margin={10}
          marginX={20}
        >
          Start Recording
        </Button>
        <Button
          onClick={stopRecording}
          colorScheme="red"
          size="lg"
          isLoading={isLoading}
          padding={10}
          margin={10}
          marginX={20}
        >
          Stop Recording
        </Button>
        <Button
          onClick={handleDownload}
          colorScheme="red"
          size="lg"
          isLoading={isLoading}
          padding={10}
          margin={10}
          marginX={20}
        >
          Download
        </Button>
        {console.log(mediaBlobUrl)}
        <Textarea
          value={value}
          onChange={handleInputChange}
          placeholder="Here is a sample placeholder"
          size="sm"
          resize={"none"}
          height={200}
        />
      </div>
    </>
  );
}
