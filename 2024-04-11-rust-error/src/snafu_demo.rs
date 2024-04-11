use snafu::Snafu;

#[derive(Snafu, Debug)]
pub enum MyAppError {
    #[snafu(display("Io error, {source}"))]
    Io { source: std::io::Error },
    #[snafu(display("Unxpected error, msg:{msg}."))]
    Unexpected { msg: String },
    #[snafu(display("Unknown error"))]
    Unknown,
}
