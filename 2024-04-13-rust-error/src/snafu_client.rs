use snafu::{ErrorCompat, ResultExt, Snafu};

pub fn print_error(error: &dyn std::error::Error) {
    let mut error = error;
    println!("Got an error:{:?}", error);
    while let Some(cause) = error.source() {
        println!("Caused by: {}", cause);
        error = cause;
    }
}

#[derive(Debug, Snafu)]
enum ClientError {
    #[snafu(display("{source}"))]
    MyError {
        // 堆栈透传
        #[snafu(backtrace)]
        source: snafu_lib::Error,
    },
}

fn read_config() -> Result<String, ClientError> {
    let config = snafu_lib::read_config().context(MySnafu {})?;
    Ok(config)
}

fn main() {
    if let Err(e) = read_config() {
        println!("Read config failed, err:{}", e);
        if let Some(bt) = ErrorCompat::backtrace(&e) {
            eprintln!("{}", bt);
        }
    }

    if let Err(e) = snafu_lib::login(1) {
        println!("Login failed, err:{}", e);
        if let Some(bt) = ErrorCompat::backtrace(&e) {
            eprintln!("{}", bt);
        }
    }
}
