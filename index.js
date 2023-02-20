if ("serial" in navigator) {
  console.log("Serial is supported");
}

// Filter on devices with the Arduino Mega USB Vendor/Product IDs.
const filters = [{ usbVendorId: 6790, usbProductId: 29987 }];

const serialOutput = document.getElementById("serialOutput");

var lineBuffer = "";

async function connect() {
  port = await navigator.serial.requestPort({ filters });
  await port.open({ baudRate: 115200 });

  document.getElementById("ledOn").disabled = false;
  document.getElementById("ledOff").disabled = false;

  var enc = new TextEncoder();

  ledOn.addEventListener("click", (event) => {
    console.log(event);
    if (port && port.writable) {
      // Convert the string to an ArrayBuffer.
      const value = "set,13,1";
      const bytes = new Uint8Array(enc.encode(value));

      const writer = port.writable.getWriter();

      writer.write(bytes);
      writer.releaseLock();
    }
  });

  ledOff.addEventListener("click", (event) => {
    if (port && port.writable) {
      // Convert the string to an ArrayBuffer.
      const value = "set,13,0";
      const bytes = new Uint8Array(enc.encode(value));

      const writer = port.writable.getWriter();

      writer.write(bytes);
      writer.releaseLock();
    }
  });

  const reader = port.readable.getReader();

  // Listen to data coming from the serial device.
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      // Allow the serial port to be closed later.
      reader.releaseLock();
      break;
    }
    // value is a Uint8Array.
    if (value.length === 1) {
      lineBuffer += String.fromCharCode(value[0]);
      console.log("🚀 ~ file: index.js:61 ~ connect ~ lineBuffer", lineBuffer);
    } else {
      lineBuffer += new TextDecoder().decode(value);
      let text = lineBuffer;
      lineBuffer = "";
      console.log("Uint8Array: ", value);
      console.log("TextDecoder: ", text);
    }
  }
}
