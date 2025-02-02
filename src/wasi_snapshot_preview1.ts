export declare function fd_read(
  fd: i32,
  iovs: i32,
  iovs_len: i32,
  nread: i32
): i32;

export declare function fd_write(
  fd: i32,
  iovs: i32,
  iovs_len: i32,
  nwritten: i32
): i32;

export declare function proc_exit(exit_code: i32): void;
