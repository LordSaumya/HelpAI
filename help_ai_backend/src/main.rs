#[macro_use]
extern crate rocket;
use rocket::data::ToByteUnit;
use rocket::figment::providers::Env;
use std::io::Cursor;
use reqwest::header::{HeaderMap, AUTHORIZATION, self};
use reqwest::multipart::Form;
use std::env;

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

    // Construct a new transcription request to https://platform.openai.com/docs/api-reference/audio/createTranscription
    let transcript: String = async {
        let client: reqwest::Client = reqwest::Client::new();
        let form: Form = Form::new()
            .part("file", reqwest::multipart::Part::bytes(bytes.into_inner()).file_name("audio.wav").mime_str("audio/wav").unwrap())
            .text("model", "whisper-1"); // Potentially add other parameters
    
        let mut headers: HeaderMap = HeaderMap::new();
        headers.insert(AUTHORIZATION, header::HeaderValue::from_str(&format!("Bearer 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")).unwrap());
    
        let response = client
            .post("https://api.openai.com/v1/audio/transcriptions")
            .multipart(form)
            .headers(headers)
            .send();

        response.await?.text().await
    }.await.unwrap_or("Error".to_string());

    Ok(transcript)
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![test_get, test_post, transcribe])
}
