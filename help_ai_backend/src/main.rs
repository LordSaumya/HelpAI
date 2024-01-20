#[macro_use]
extern crate rocket;
use rocket::data::ToByteUnit;

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
   let bytes: rocket::data::Capped<Vec<u8>> = file.open(5.megabytes()).into_bytes().await.map_err(|e| format!("Error reading file: {}", e))?;

   // Convert the bytes to a string, handling potential encoding issues
   let contents: String = String::from_utf8(bytes.into_inner()).map_err(|e| format!("Error reading file: {}", e))?;

   // Return the file contents as a string
   Ok(contents)
}


#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![test_get, test_post, transcribe])
}
