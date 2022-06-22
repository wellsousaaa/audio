import { useEffect, useRef, useState } from "react";
import { initialKeys } from "./helpers/keys";
import Keyboard from "react-simple-keyboard";
import "./styles/keyboard.css";
const ipcRenderer = window.require("electron").ipcRenderer;

function App() {
  const keyboard = useRef();
  const [keys, setKeys] = useState(initialKeys);

  const onKeyPress = async (button) => {
    console.log("Button pressed", button);
    const file = await ipcRenderer.invoke("open-file", button);
    if(!file) return;
    
    const source = AudioContext.createBufferSource();
    source.buffer = file;
    source.connect(AudioContext.destination);
    source.start(0);
  };

  useEffect(() => {
    keyboard.current.recurseButtons((buttonElement) => {
      console.log("buttonElement", buttonElement);
      buttonElement.dataset.value = keys[buttonElement.dataset.skbtn];
    });
  }, []);

  return (
    <div className="App">
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        onKeyPress={onKeyPress}
      />
    </div>
  );
}

export default App;
