use snafu::prelude::*;

#[derive(Snafu, Debug)]
pub enum MyError {
    #[snafu(display("Io error, {source}\n{backtrace}"))]
    Io {
        source: std::io::Error,
        backtrace: snafu::Backtrace,
    },
    #[snafu(display("Unxpected error, msg:{msg}."))]
    Unexpected { msg: String },
    #[snafu(display("Unknown error"))]
    Unknown,
}

pub type Result<T> = std::result::Result<T, MyError>;

pub fn read_file() -> Result<String> {
    let body = std::fs::read_to_string("input.txt").context(IoSnafu {})?;

    Ok(body)
}

pub fn foo(i: i8) -> Result<()> {
    ensure!(i <= 10, UnexpectedSnafu { msg: "too large" });

    Ok(())
}

pub fn bar(i: i8) -> Result<()> {
    foo(i)
}

pub fn foobar(i: i8) -> Result<()> {
    bar(i)
}

fn main() {
    if let Err(e) = foobar(100) {
        println!("Foobar failed, err{}", e);
    }

    if let Err(e) = read_file() {
        println!("Read file failed, err:{}", e);
    }
}
