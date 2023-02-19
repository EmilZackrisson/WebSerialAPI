if ("serial" in navigator) {
  console.log("Serial is supported");
}

// Filter on devices with the Arduino Uno USB Vendor/Product IDs.
const filters = [{ usbVendorId: 6790, usbProductId: 29987 }];

let port;

document.querySelector("button").addEventListener("click", async () => {
  // Prompt user to select any serial port.
  port = await navigator.serial.requestPort({ filters });
  console.log("🚀 ~ file: Serial.js:8 ~ document.querySelector ~ port", port);
  //   const { usbProductId, usbVendorId } = port.getInfo();

  await port.open({ baudRate: 115200 });

  const reader = port.readable.getReader();
  const textDecoder = new TextDecoderStream();
  //   const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);

  // Listen to data coming from the serial device.
  while (port.readable) {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // |reader| has been canceled.
          break;
        }
        // Do something with |value|...
        console.log(value);
        console.log(decode(value));
      }
    } catch (error) {
      // Handle |error|...
      console.log(error);
    } finally {
      reader.releaseLock();
    }
  }
});

function decode(Uint8Array) {
  var encodedString = String.fromCharCode.apply(null, Uint8Array),
    decodedString = decodeURIComponent(encodedString);
  return decodedString;
}

async function ledOn() {
  const textEncoder = new TextEncoderStream();
  const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

  const writer = textEncoder.writable.getWriter();

  await writer.write("hello").then(() => {
    writer.releaseLock();
  });
}
