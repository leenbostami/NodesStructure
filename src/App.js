import React, { useState, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls
} from "react-flow-renderer";
import "./styles.css";
import Sidebar from "./sidebar";

const initialElements = [
  {
    id: "node_1",
    type: "input",
    data: { label: "Node" },
    position: { x: 450, y: 100 },
    style: {  width: '200px', height: '28px',display: 'flex',padding: '16px',borderColor:'#bababa'},

  }
];
let id = 2;
const getId = () => `node_${id++}`;

export default function App() {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const [NodeText, setNodeText] = useState("");
  const [NodeId, setNodeId] = useState("");
  const [showTextInput, ChangeshowTextInput] = useState(false);
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  const onElementClick = (event,element)=>{
      ChangeshowTextInput(true);
      setNodeText(element.data.label);
      setNodeId(element.id)

  }
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    const shape = event.dataTransfer.getData("shape");

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    });
    if(shape ==='circle'){
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `Node` },
        style: { borderRadius: '50%', width: '60px', height: '60px',display: 'flex',justifyContent: 'center',alignItems: 'center',borderColor:'#bababa'},
      };
      setElements((es) => es.concat(newNode));

    }
    else{
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `Node` },
        style: {  width: '200px', height: '28px',display: 'flex',padding: '16px',borderColor:'#bababa'},

      };
      setElements((es) => es.concat(newNode));

    }
    
  };
  function handlerChangeText(event) {
    setNodeText(event.target.value);
  };

  function UpdateText(){

    console.log(elements);
    setElements((nds) =>
      nds.map((node) => {
        if (node.id === NodeId) {
     
          node.data = {
            label: NodeText,
          };
        }
        return node;
      })
    );

 }

 const Download = () => {
  const element = document.createElement("a");
  const textFile = new Blob([JSON.stringify(elements)], {type: 'Json'}); 
  element.href = URL.createObjectURL(textFile);
  element.download = "Nodes.json";
  document.body.appendChild(element); 
  element.click();
 }
const  handleFile = (e) => {
  const content = e.target.result;
  console.log('file content',  JSON.parse(content));
  const fileToobj=JSON.parse(content);
  console.log('fileToobj',fileToobj)
  for (const i in fileToobj) {
    console.log(`${i}: ${fileToobj[i].position.x}`);

    const newNode = {
      id: fileToobj[i].id,
      type:fileToobj[i].type,
      position:{x: fileToobj[i].position.x, y: fileToobj[i].position.y},
      data: { label: fileToobj[i].data.label },
      style: fileToobj[i].style,
    };
    setElements((es) => es.concat(newNode));

  }
}

const handleChangeFile = (file) => {
  let fileData = new FileReader();
  fileData.onloadend = handleFile;
  fileData.readAsText(file);
  
}
  return (
    <div>
    <div className="topbar">
    <div className="form">
    {showTextInput?
    <div className="leftside" >
    <label className="label">Node text</label>
    <input name="nodetext"  className="nodetext" value={NodeText} onChange={handlerChangeText}/>
    <button onClick={UpdateText} className="update">Update</button>
    </div> 
  :
  <div></div>
  }
  
    <div className="rightside">
    <label className="custom-file-upload">
    <input type="file" className="upload" accept=".json" onChange={e =>handleChangeFile(e.target.files[0])}/>
     Upload
    </label>

    <button onClick={Download} className="download">Download</button>
    </div>
  
    </div>
      </div>
    <div className="dndflow">
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          style={{ height: "650px", width: "500px" }}
          ref={reactFlowWrapper}
        >
          <ReactFlow
            elements={elements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onElementClick={onElementClick}
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
    </div>
  );
}
