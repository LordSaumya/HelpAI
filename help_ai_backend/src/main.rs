#[macro_use]
extern crate rocket;
use rocket::data::ToByteUnit;
use std::io::Cursor;
use reqwest::header::{HeaderMap, AUTHORIZATION, self};
use reqwest::multipart::Form;

// Test routes
#[get("/")]
fn test_get() -> &'static str {
    "Get works"
}

#[post("/test")]
fn test_post() -> &'static str {
    "Post works"
}

#[post("/transcribe", data = "<file>")]
async fn transcribe(file: rocket::data::Data<'_>) -> Result<String, String> {
    // Access the uploaded file data
    let bytes: rocket::data::Capped<Vec<u8>> = file
        .open(5.megabytes())
        .into_bytes()
        .await
        .map_err(|e: std::io::Error| format!("Error reading file: {}", e))?;

    // Convert the WAV bytes to a suitable format for transcription
    let audio_data: Vec<f32> = hound::WavReader::new(Cursor::new(bytes.into_inner()))
        .map_err(|e| format!("Error reading WAV file: {}", e))?
        .into_samples::<i16>()
        .map(|s: Result<i16, hound::Error>| s.unwrap() as f32)
        .collect::<Vec<_>>();

    // // Construct a new transcription request to https://platform.openai.com/docs/api-reference/audio/createTranscription
    // let transcript: String = async {
    //     let client: reqwest::Client = reqwest::Client::new();
    //     let form = Form::new()
    //         .file("file", audio_data)
    //         .text("model", "whisper-1"); // Potentially add other parameters
    
    //     let mut headers: HeaderMap = HeaderMap::new();
    //     headers.insert(AUTHORIZATION, header::HeaderValue::from_str("Bearer ").unwrap());
    
    //     let response = client
    //         .post("https://api.openai.com/v1/audio/transcriptions")
    //         .form(&form)
    //         .headers(headers)
    //         .send();

    //     response.await?.text().await
    // }.await.unwrap_or("Error".to_string());

    Ok("transcript".to_string())
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![test_get, test_post, transcribe])
}
