use thiserror::Error;

#[derive(Error, Debug)]
pub enum MyAppError {
    #[error("io error, {0}")]
    Io(#[from] std::io::Error),
    #[error("Unxpected error, `{0}`.")]
    Unexpected(String),
    #[error("unknown error")]
    Unknown,
}

pub type Result<T> = std::result::Result<T, MyAppError>;

pub fn foo(i: i8) -> Result<()> {
    if i > 10 {
        return Err(MyAppError::Unexpected("too large".to_string()));
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
    let body = std::fs::read_to_string("input.txt").map_err(|e| MyAppError::Io(e))?;
    Ok(body)
}
