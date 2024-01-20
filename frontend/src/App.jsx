import { Button } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import axios from 'axios';
import {
  useReactMediaRecorder,
} from "react-media-recorder";
import React from "react";

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [startRecord, setStartRecord] = React.useState(false);
  const [stopRecord, setStopRecord] = React.useState(true);
  // const [transcription, setTranscription] = React.useState('');
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  const handleStartRecording = () => {
    startRecording();
    setStartRecord(true)
    setStopRecord(false)
  }
  const handleStopRecording = () => {
    stopRecording()
    setIsLoading(true)
    fetchTranscript()
    .then(() => {
      axios.post('/response', {transcript: transcript})
        .then(res => {
          setIsLoading(false);
          setStopRecord(true)
          setStartRecord(false)
          setAnswer(res.data.answer)
        })
        .catch(err => {
          setIsLoading(false);
          setStopRecord(true)
          setStartRecord(false)
          console.error(err)
        })
      })
      .catch((err) => {
        // Handle any errors
        console.error(err);
      });
  };

  const fetchTranscript = async () => {
    const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
    try {
      const res = await axios.post("/transcribe", blob);
      console.log(res.data);
      setTranscript(
        (prevTranscript) => prevTranscript + "\n" + res.data.text
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleTranscriptChange = (e) => {
    let inputValue = e.target.value;
    setTranscript(inputValue);
  };

  const handleAnswerChange = (e) => {
    let inputValue = e.target.value;
    setAnswer(inputValue);
  };

  return (
    <>
      <div className="min-h-screen p-28 flex flex-col max-w-screen-lg justify-center items-center">
        <h1 className="text-6xl text-center font-bold m-10">Help.AI</h1>
        <Textarea
          value={transcript}
          onChange={handleTranscriptChange}
          placeholder="Transcription goes here..."
          size="sm"
          resize={"none"}
          isReadOnly
        />
        <Button
          onClick={!startRecord ? handleStartRecording : handleStopRecording}
          colorScheme={!startRecord ? "green" : "red"}
          size="lg"
          isLoading={isLoading}
          padding={10}
          margin={10}
          marginX={20}
        >
          {!startRecord ? "Start Recording" : "Stop Recording"}
        </Button>
        <Textarea
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Press stop and look here if u need help..."
          size="2xl"
          textIndent={10}
          resize={"none"}
          height={200}
          isReadOnly
        />
      </div>
    </>
  );
}
