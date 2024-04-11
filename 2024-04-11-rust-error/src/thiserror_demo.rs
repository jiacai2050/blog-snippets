#![feature(error_generic_member_access)]
// Unable to get #[from] + backtrace example to compile #257
// - https://github.com/dtolnay/thiserror/issues/257

use thiserror::Error;

#[derive(Error, Debug)]
pub enum MyError {
    #[error("IO error, source:{source}.")]
    Io {
        #[from]
        source: std::io::Error,
        backtrace: std::backtrace::Backtrace,
    },
    #[error("Unxpected error, `{0}`.")]
    Unexpected(String),
    #[error("unknown error")]
    Unknown,
}

pub type Result<T> = std::result::Result<T, MyError>;

pub fn foo(i: i8) -> Result<()> {
    if i > 10 {
        return Err(MyError::Unexpected("too large".to_string()));
    }

    Ok(())
}

pub fn bar(i: i8) -> Result<()> {
    foo(i)
}

pub fn foobar(i: i8) -> Result<()> {
    bar(i)
}

pub fn read_file() -> Result<String> {
    let body = std::fs::read_to_string("input.txt")?;
    Ok(body)
}

fn main() {
    if let Err(e) = foobar(100) {
        println!("{:?}", e);
    }

    if let Err(e) = read_file() {
        match e {
            MyError::Io { .. } => println!("Get IO error"),
            _ => unreachable!(),
        }
        println!("{:#?}", e);
    }
}
