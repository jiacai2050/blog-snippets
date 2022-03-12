#![feature(prelude_import)]
#[prelude_import]
use std::prelude::rust_2021::*;
#[macro_use]
extern crate std;
use emacs::{defun, Env, Result, Value};
/// This states that the module is GPL-compliant.
/// Emacs won't load the module if this symbol is undefined.
#[no_mangle]
#[allow(non_upper_case_globals)]
pub static plugin_is_GPL_compatible: ::std::os::raw::c_int = 0;
fn init(_: &Env) -> Result<()> {
    Ok(())
}
#[allow(non_snake_case)]
fn __emrs_auto_init__(env: &::emacs::Env) -> ::emacs::Result<::emacs::Value<'_>> {
    let feature = "greeting".to_owned();
    {
        let mut prefix = ::emacs::init::__PREFIX__
            .try_lock()
            .expect("Failed to acquire write lock on module prefix");
        *prefix = [feature.clone(), "-".to_owned()];
    }
    ::emacs::init::__MOD_IN_NAME__.store(true, ::std::sync::atomic::Ordering::Relaxed);
    {
        let funcs = ::emacs::init::__INIT_FNS__
            .try_lock()
            .expect("Failed to acquire a read lock on map of initializers");
        for (_, func) in funcs.iter() {
            func(env)?
        }
    }
    init(env)?;
    env.provide(&feature)
}
/// Entry point for Emacs's module loader.
#[no_mangle]
pub unsafe extern "C" fn emacs_module_init(
    runtime: *mut ::emacs::raw::emacs_runtime,
) -> ::std::os::raw::c_int {
    ::emacs::init::initialize(&::emacs::Env::from_runtime(runtime), __emrs_auto_init__)
}
/// Entry point for live-reloading (by `rs-module`) during development.
#[no_mangle]
pub unsafe extern "C" fn emacs_rs_module_init(
    raw: *mut ::emacs::raw::emacs_env,
) -> ::std::os::raw::c_int {
    ::emacs::init::initialize(&::emacs::Env::new(raw), __emrs_auto_init__)
}
fn say_hello(env: &Env, name: String) -> Result<Value<'_>> {
    env.message(&{
        let res = ::alloc::fmt::format(::core::fmt::Arguments::new_v1(
            &["Hello, ", "!"],
            &[::core::fmt::ArgumentV1::new_display(&name)],
        ));
        res
    })
}
fn __emr_O_say_hello(env: &::emacs::CallEnv) -> ::emacs::Result<::emacs::Value<'_>> {
    let arg0 = env.get_arg(0usize).into_rust()?;
    let output = say_hello(&**env, arg0)?;
    #[allow(clippy::unit_arg)]
    ::emacs::IntoLisp::into_lisp(output, env)
}
fn __emrs_E_say_hello(env: &::emacs::Env) -> ::emacs::Result<()> {
    let prefix = ::emacs::init::lisp_path({
        if ::emacs::init::__MOD_IN_NAME__.load(::std::sync::atomic::Ordering::Relaxed) {
            "helloworld_rust"
        } else {
            ""
        }
    });
    {
        use ::emacs::func::Manage;
        env.fset(
            &{
                let res = ::alloc::fmt::format(::core::fmt::Arguments::new_v1(
                    &["", ""],
                    &[
                        ::core::fmt::ArgumentV1::new_display(&prefix),
                        ::core::fmt::ArgumentV1::new_display(&"say-hello"),
                    ],
                ));
                res
            },
            {
                use ::emacs::func::HandleCall;
                use ::emacs::func::Manage;
                unsafe extern "C" fn extern_lambda(
                    env: *mut ::emacs::raw::emacs_env,
                    nargs: isize,
                    args: *mut ::emacs::raw::emacs_value,
                    _data: *mut ::std::os::raw::c_void,
                ) -> ::emacs::raw::emacs_value {
                    let env = ::emacs::Env::new(env);
                    let env = ::emacs::CallEnv::new(env, nargs, args);
                    env.handle_call(__emr_O_say_hello)
                }
                unsafe {
                    env.make_function(
                        extern_lambda,
                        1usize..1usize,
                        "\n\n(fn NAME)",
                        ::std::ptr::null_mut(),
                    )
                }
            }?,
        )?;
    }
    Ok(())
}
extern "C" fn __emrs_R_say_hello() {
    let mut full_path = "helloworld_rust".to_owned();
    full_path.push_str("::");
    full_path.push_str("say_hello");
    let mut funcs = ::emacs::init::__INIT_FNS__
        .lock()
        .expect("Failed to acquire a write lock on map of initializers");
    funcs.insert(full_path, ::std::boxed::Box::new(__emrs_E_say_hello));
}
#[used]
#[allow(non_upper_case_globals)]
#[doc(hidden)]
#[link_section = "__DATA,__mod_init_func"]
static __emrs_R_say_hello___rust_ctor___ctor: unsafe extern "C" fn() = {
    unsafe extern "C" fn __emrs_R_say_hello___rust_ctor___ctor() {
        __emrs_R_say_hello()
    };
    __emrs_R_say_hello___rust_ctor___ctor
};
