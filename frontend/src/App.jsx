import { Button, ButtonGroup } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import axios from 'axios';
import {
  ReactMediaRecorder,
  useReactMediaRecorder,
} from "react-media-recorder";
import React from "react";

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [answer, setAnswer] = React.useState('');
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
    axios.post('/response', {transcript: transcript})
      .then(res => {
        setIsLoading(false);
        setAnswer(res.data.answer)
      })
      .catch(err => {
        console.error(err)
      })
  };

  React.useEffect(() => {
    const fetchTranscript = async () => {
      const blob = new Blob([mediaBlobUrl], { type: "audio/wav" })
      
      try {
        const res = await axios.post('/transcribe', blob);
        console.log(res.data)
        setTranscript(prevTranscript => prevTranscript + '\n' + res.data.text);
      } catch (err) {
        console.error(err);
      }
    };

    if(record){
      // Initially, fetch the transcript
      fetchTranscript();
  
      // Set up an interval to fetch the transcript every 10 seconds
      const intervalId = setInterval(fetchTranscript, 10000);
      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [record]);

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
      <div className="min-h-screen p-28 flex flex-col">
        <Textarea
          value={transcript}
          onChange={handleTranscriptChange}
          placeholder="Transcription goes here..."
          size="sm"
          resize={"none"}
          isReadOnly
        />
        <Button
          onClick={!record ? handleStartRecording : handleStopRecording}
          colorScheme={!record ? "green" : "red"}
          size="lg"
          isLoading={isLoading}
          padding={10}
          margin={10}
          marginX={20}
        >
          {!record ? "Start Recording" : "Stop Recording"} 
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
