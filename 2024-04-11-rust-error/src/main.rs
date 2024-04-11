mod anyhow_demo;
mod snafu_demo;
mod thiserror_demo;

use std::error::Error;

fn print_error(mut error: &dyn std::error::Error) {
    println!("Got an error:{:?}", error.to_string());
    while let Some(cause) = error.source() {
        println!("Caused by: {}", cause);
        error = cause;
    }
}

fn main() {
    if let Err(err) = anyhow_demo::read_file() {
        println!("Error:{:?}", err);
    }
    // if let Err(err) = anyhow_demo::foobar(100) {
    //     println!("Error:{:?}", err);
    // }
}
