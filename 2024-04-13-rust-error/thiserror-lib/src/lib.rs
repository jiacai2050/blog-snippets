use anyhow::Context;
use thiserror::Error;

#[derive(Debug, Error)]
#[error(transparent)]
pub struct MyError(#[from] InnerError);

impl From<anyhow::Error> for MyError {
    fn from(source: anyhow::Error) -> Self {
        Self(InnerError::Other { source })
    }
}

impl MyError {
    pub fn kind(&self) -> ErrorKind {
        match self.0 {
            InnerError::UserLocked { .. } => ErrorKind::PermissionDenied,
            InnerError::InvalidUser { .. } => ErrorKind::BadRequest,
            InnerError::Other { .. } => ErrorKind::InternalError,
        }
    }
}

// 客户端在匹配时，必须加个 match all 分支，这样升级时就不用担心 breaking changes
#[non_exhaustive]
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
pub enum ErrorKind {
    PermissionDenied,
    BadRequest,
    InternalError,
}

#[derive(Debug, Error)]
enum InnerError {
    #[error("User ID {user_id} is invalid")]
    InvalidUser { user_id: i32 },
    #[error("User ID {user_id} is locked")]
    UserLocked { user_id: i32 },
    #[error(transparent)]
    Other {
        #[from]
        source: anyhow::Error,
    },
}

// That's all it takes! The rest is demonstration of how to use it.
pub fn login(id: i32) -> Result<(), MyError> {
    validate_user(id)?;
    is_user_locked(id)?;
    other_checks(id)?;
    Ok(())
}

fn validate_user(user_id: i32) -> Result<(), MyError> {
    if user_id == 0 {
        return Err(InnerError::InvalidUser { user_id })?;
    }

    Ok(())
}

fn is_user_locked(user_id: i32) -> Result<(), MyError> {
    Err(InnerError::UserLocked { user_id })?;

    Ok(())
}

fn other_checks(user_id: i32) -> Result<(), MyError> {
    Err(anyhow::anyhow!(
        "just kidding{}... this function always fails!",
        user_id
    ))?;

    Ok(())
}

pub fn read_config() -> Result<String, MyError> {
    let body = std::fs::read_to_string("input.txt").context("couldn't open the file")?;

    Ok(body)
}
