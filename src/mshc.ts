import * as wasi from "./wasi_snapshot_preview1";

const STDIN = 0;
const STDOUT = 1;
const STDERR = 2;

const CHAR_NEWLINE = 0x0a; // '\n'
const CHAR_SEMI = 0x3b; // ';'
const CHAR_GREATER = 0x3e; // '>'
const CHAR_SPACE = 0x20; // ' '

let mem!: u32;

export function _start(): void {
  mem = __heap_base as u32;

  const nread_ref = memory.data(4) as u32;
  const contents_ref_ref = memory.data(4) as u32;
  const err = fread(STDIN, nread_ref, contents_ref_ref);
  if (err) {
    wasi.proc_exit(err);
  }

  const nread = load<u32>(nread_ref);
  const contents_ref = load<u32>(contents_ref_ref);

  let i = 0 as u32;
  while (true) {
    if (i === nread) {
      break;
    }

    const char = load<u8>(contents_ref + i);

    if (char === CHAR_NEWLINE) {
      i += 1;
      continue;
    }

    if (char === CHAR_SEMI) {
      for (; i < nread; i++) {
        if (load<u8>(contents_ref + i) === CHAR_NEWLINE) {
          break;
        }
      }
      continue;
    }

    if (char === CHAR_GREATER) {
      while (true) {
        i += 1;
        if (i >= nread || load<u8>(contents_ref + i) === CHAR_NEWLINE) {
          break;
        }

        if (load<u8>(contents_ref + i) !== CHAR_SPACE) {
          panic_syntax_error(i);
        }

        let byte = 0 as u8;

        i += 1;
        if (i >= nread) {
          panic_syntax_error(i);
        }
        const byte_hi = load<u8>(contents_ref + i);
        if (byte_hi >= 0x30 && byte_hi <= 0x39) {
          byte = (byte_hi - 0x30) * 16;
        } else if (byte_hi >= 0x41 && byte_hi <= 0x46) {
          byte = (byte_hi - 0x41 + 10) * 16;
        } else {
          panic_syntax_error(i);
        }

        i += 1;
        if (i >= nread) {
          panic_syntax_error(i);
        }
        const byte_lo = load<u8>(contents_ref + i);
        if (byte_lo >= 0x30 && byte_lo <= 0x39) {
          byte += byte_lo - 0x30;
        } else if (byte_lo >= 0x41 && byte_lo <= 0x46) {
          byte += byte_lo - 0x41 + 10;
        } else {
          panic_syntax_error(i);
        }

        const byte_ref = memory.data(1) as u32;
        store<u8>(byte_ref, byte);

        fputs(STDOUT, byte_ref, 1);
      }

      continue;
    }

    panic_syntax_error(i);
  }
}

function panic_syntax_error(offset: u32): void {
  // "syntax error: "
  const err_message_ref = memory.data<u8>([
    0x73, 0x79, 0x6e, 0x74, 0x61, 0x78, 0x20, 0x65, 0x72, 0x72, 0x6f, 0x72,
    0x3a, 0x20,
  ]) as u32;
  fputs(STDERR, err_message_ref, 14);
  fprint_u32(STDERR, offset);
  const newline = memory.data<u8>([CHAR_NEWLINE as u8]) as u32;
  fputs(STDERR, newline, 1);

  wasi.proc_exit(1);
}

function fprint_u32(fd: i32, n: u32): i32 {
  const num_buf_len = 10 as u32;
  const num_buf = memory.data(num_buf_len) as u32;

  let i = num_buf_len;
  while (true) {
    i -= 1;
    const digit = (48 + (n % 10)) as u8;
    store<u8>(num_buf + i, digit);
    n = n / 10;
    if (n == 0) {
      break;
    }
  }

  return fputs(fd, num_buf + i, num_buf_len - i);
}

function fread(fd: i32, nread_ref: u32, contents_ref_ref: u32): i32 {
  const contents_ref = mem;
  const iov = memory.data(8) as u32;

  let nread = 0;

  while (true) {
    store<i32>(iov, contents_ref + nread);
    store<i32>(iov, 256, 4);

    const err = wasi.fd_read(fd, iov, 1, nread_ref);
    if (err) {
      return err;
    }

    const nread_now = load<u32>(nread_ref);
    if (nread_now === 0) {
      break;
    }

    nread += nread_now;
    mem += nread_now;
  }

  store<u32>(nread_ref, nread);
  store<u32>(contents_ref_ref, contents_ref);

  return 0;
}

function fputs(fd: i32, message_ptr: u32, message_len: u32): i32 {
  const iov = memory.data(8) as u32;
  store<i32>(iov, message_ptr);
  store<i32>(iov, message_len, 4);

  const nwritten = memory.data(4) as u32;
  return wasi.fd_write(fd, iov, 1, nwritten);
}
