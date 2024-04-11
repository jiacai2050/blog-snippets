use std::ffi::{c_char, c_int, CStr, CString};

#[no_mangle]
pub extern "C" fn call_from_c() {
    println!("Just called a Rust function from C!");
}

#[repr(C)]
pub struct Foo {
    pub a: c_int,
    pub b: *mut c_char,
}

#[no_mangle]
pub extern "C" fn new_foo() -> *mut Foo {
    let c_str = CString::new("hello world").unwrap();
    let foo = Box::new(Foo {
        a: 1,
        b: c_str.into_raw(),
    });

    Box::into_raw(foo)
}

#[no_mangle]
pub extern "C" fn free_foo(foo: *mut Foo) {
    if !foo.is_null() {
        unsafe {
            let foo = Box::from_raw(foo);
            let _ = CString::from_raw(foo.b);
        }
    }
}

#[no_mangle]
pub extern "C" fn say_foo(foo: *mut Foo) {
    if foo.is_null() {
        println!("Foo is null");
    } else {
        println!("Foo [a = {}, b = {:?}]", unsafe { (*foo).a }, unsafe {
            CStr::from_ptr((*foo).b)
        });
    }
}

#[no_mangle]
pub extern "C" fn ub_demo(foo: *mut Foo) {
    let immut_ref = unsafe { foo.as_ref() }.unwrap();
    println!("Immutable ref is {}", immut_ref.a);

    // Create mut_ref is UB, since there is already an  immutable reference and it's still alive.
    let mut_ref = unsafe { foo.as_mut() }.unwrap();
    mut_ref.a = 2;
    println!("Mutable ref is {}", mut_ref.a);

    println!("Immutable ref is {}", immut_ref.a);
}
