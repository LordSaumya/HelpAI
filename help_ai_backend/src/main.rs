#[macro_use]
extern crate rocket;
use reqwest::header::{self, HeaderMap, AUTHORIZATION};
use reqwest::multipart::Form;
use rocket::data::ToByteUnit;
use serde_json::json;

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
            .part(
                "file",
                reqwest::multipart::Part::bytes(bytes.into_inner())
                    .file_name("audio.wav")
                    .mime_str("audio/wav")
                    .unwrap(),
            )
            .text("model", "whisper-1"); // Potentially add other parameters

        let mut headers: HeaderMap = HeaderMap::new();
        headers.insert(
            AUTHORIZATION,
            header::HeaderValue::from_str(&format!(
                "Bearer "
            ))
            .unwrap(),
        );

        let response = client
            .post("https://api.openai.com/v1/audio/transcriptions")
            .multipart(form)
            .headers(headers)
            .send();

        response.await?.text().await
    }
    .await
    .unwrap_or("Error".to_string());

    Ok(transcript)
}

#[post("/response/<input>")]
async fn respond(input: String) -> String {
    let mut headers: HeaderMap = HeaderMap::new();
    headers.insert(
        AUTHORIZATION,
        header::HeaderValue::from_str(&format!(
            "Bearer "
        ))
        .unwrap(),
    );

    let request_body: serde_json::Value = json!({
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "system",
            "content": "You are a helpful assistant trained to answer common interview questions about data structures and algorithms."
          },
          {
            "role": "user",
            "content": input
          }
        ]
      });
    let client: reqwest::Client = reqwest::Client::new();
    let response_text = client
        .post("https://api.openai.com/v1/chat/completions")
        .json(&request_body)
        .headers(headers)
        .send()
        .await
        .unwrap();
    serde_json::from_str::<serde_json::Value>(&response_text.text().await.unwrap()).unwrap()["choices"][0]["message"]["content"].as_str().unwrap().to_string()
        .to_string()
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![test_get, test_post, transcribe, respond])
}
