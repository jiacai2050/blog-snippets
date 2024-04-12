use snafu::ensure;
use snafu::whatever;
use snafu::Backtrace;
use snafu::ResultExt;
use snafu::Snafu;

#[derive(Debug, Snafu)]
pub struct Error(InnerError);

impl Error {
    pub fn kind(&self) -> ErrorKind {
        match self.0 {
            InnerError::UserLocked { .. } => ErrorKind::PermissionDenied,
            InnerError::InvalidUser { .. } => ErrorKind::BadRequest,
            InnerError::Whatever { .. } => ErrorKind::InternalError,
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

// That's all it takes! The rest is demonstration of how to use it.
pub fn login(id: i32) -> Result<(), Error> {
    validate_user(id)?;
    is_user_locked(id)?;
    other_checks()?;
    Ok(())
}

#[derive(Debug, Snafu)]
enum InnerError {
    #[snafu(display("User ID {user_id} is invalid"))]
    InvalidUser { user_id: i32 },
    #[snafu(display("User ID {user_id} is locked"))]
    UserLocked { user_id: i32 },
    #[snafu(whatever, display("{message}"))]
    Whatever {
        message: String,
        #[snafu(source(from(Box<dyn std::error::Error>, Some)))]
        source: Option<Box<dyn std::error::Error>>,
        // 由用户控制是否生成堆栈，RUST_BACKTRACE=1
        backtrace: Option<Backtrace>,
    },
}

fn validate_user(user_id: i32) -> Result<(), Error> {
    ensure!(user_id != 0, InvalidUserSnafu { user_id });

    Ok(())
}

fn is_user_locked(user_id: i32) -> Result<(), Error> {
    UserLockedSnafu { user_id }.fail()?;

    Ok(())
}

fn other_checks() -> Result<(), InnerError> {
    whatever!("More condition checks");
}

pub fn read_config() -> Result<String, Error> {
    let body = std::fs::read_to_string("input.txt")
        .whatever_context::<_, InnerError>("couldn't open the file")?;

    Ok(body)
}
