import { Button, ButtonGroup } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import axios from 'axios';
import {
  ReactMediaRecorder,
  useReactMediaRecorder,
} from "react-media-recorder";
import React from "react";

export default function App() {
  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  // const [transcription, setTranscription] = React.useState('');
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = () => {
        setIsLoading(true)
        const formData = new FormData();
        formData.append(
          "audio",
          new Blob([recordedChunks], { type: "audio/wav" }),
          "recorded-audio.wav"
        );
        axios.post('/transcribe', formData)
          .then(res => {
            setIsLoading(false)
            console.log(res.data)
          })
          .catch(err => {
            setIsLoading(false)
            console.error(err)
          })
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
        <Button
          onClick={startRecording}
          colorScheme="green"
          size="lg"
          isLoading={isLoading}
          padding={10}
          margin={1}
          marginX={20}
        >
          Start Recording
        </Button>
        <Button
          onClick={() => {stopRecording; handleStopRecording}}
          colorScheme="red"
          size="lg"
          isLoading={isLoading}
          padding={10}
          margin={10}
          marginX={20}
        >
          Stop Recording
        </Button>
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
