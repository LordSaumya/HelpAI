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
  const [record, setRecord] = React.useState(false);
  // const [transcription, setTranscription] = React.useState('');
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  const handleStartRecording = () => {
    startRecording();
    setRecord(true)
  }
  const handleStopRecording = () => {
    stopRecording()
    setIsLoading(true)
    setRecord(false)
    const formData = new FormData();
    formData.append(
      "audio",
      new Blob([mediaBlobUrl], { type: "audio/wav" }),
      "recorded-audio.wav"
    );
    axios.post('/transcribe', formData)
      .then(res => {
        console.log('data sent')
        setIsLoading(false)
        console.log(res.data)
      })
      .catch(err => {
        setIsLoading(false)
        console.error(err)
      })
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
          onClick={!record ? handleStartRecording : handleStopRecording}
          colorScheme={!record ? "green" : "red"}
          size="lg"
          isLoading={isLoading}
          padding={10}
          margin={1}
          marginX={20}
        >
          {!record ? "Start Recording" : "Stop Recording"} 
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
