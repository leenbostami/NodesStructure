import React from "react";

export default () => {
  const onDragStart = (event, nodeType,shape) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("shape", shape);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <aside>
     <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default","rectangle")}
        draggable
      >
         Node
      </div>

      <div
        className="dndnode circle"
        onDragStart={(event) => onDragStart(event, "default","circle")}
        draggable
      >
         Node
      </div>
   
    </aside>
  );
};
