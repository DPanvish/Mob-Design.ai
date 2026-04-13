"use client"

import { MouseEvent, useEffect, useRef, useState } from 'react';
import { Rnd } from "react-rnd"
import { useCanvas } from '@/app/context/canvas-context'
import { getHTMLWrapper } from '@/lib/frame-wrapper';
import { DeviceFramePropType } from '@/types'
import { TOOL_MODE_ENUM } from '@/lib/canvas';
import { cn } from '@/lib/utils';
import DeviceFrameToolbar from './device-frame-toolbar';

const DeviceFrame = ({
    html,
    title = "Untitled",
    width = 420,
    minHeight = 800,
    initialPosition = {x: 0, y: 0},
    frameId,
    scale = 1,
    toolMode,
    theme_style,
    onOpenHtmlDialog
}: DeviceFramePropType) => {
  const {selectedFrameId, setSelectedFrameId} = useCanvas();
  const [frameSize, setFrameSize] = useState({width, height: minHeight});
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isSelected = selectedFrameId === frameId;
  const fullHtml = getHTMLWrapper(html, title, theme_style, frameId);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if(event.data.type === "FRAME_HEIGHT" && event.data.frameId === frameId){
        setFrameSize((prev) => ({
          ...prev,
          height: event.data.height
        }));
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [frameId])
  
  return (
    <Rnd
      default={{
          x: initialPosition.x,
          y: initialPosition.y,
          width,
          height: frameSize.height
        }}
        minWidth={width}
        minHeight={minHeight}
        size={{
          width: frameSize.width,
          height: frameSize.height,
        }}
        disableDragging={toolMode === TOOL_MODE_ENUM.HAND}
        enableResizing={isSelected && toolMode !== TOOL_MODE_ENUM.HAND}
        scale={scale}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          
          if(toolMode === TOOL_MODE_ENUM.SELECT){
            setSelectedFrameId(frameId);
          }
        }}
        resizeHandleComponent={{
          topLeft: isSelected ? <Handle /> : undefined,
          topRight: isSelected ? <Handle /> : undefined,
          bottomLeft: isSelected ? <Handle /> : undefined,
          bottomRight: isSelected ? <Handle /> : undefined,
        }}
        resizeHandleStyles={{
          top: {cursor: "ns-resize"},
          bottom: {cursor: "ns-resize"},
          left: {cursor: "ew-resize"},
          right: {cursor: "ew-resize"}
        }}
        onResize={(e, direction, ref) => {
          setFrameSize({
            width: parseInt(ref.style.width, 10) || frameSize.width,
            height: parseInt(ref.style.height, 10) || frameSize.height,
          });
        }}
        className={cn("relative z-10", isSelected && toolMode !== TOOL_MODE_ENUM.HAND && 
          "ring-3 ring-blue-400 ring-offset-1", 
          toolMode === TOOL_MODE_ENUM.HAND
          ? "cursor-grab! active:cursor-grabbing!"
          : "cursor-move"
        )}
      >
        <div className="w-full h-full">
          <DeviceFrameToolbar
            title={title}
            isSelected={isSelected && toolMode !== TOOL_MODE_ENUM.HAND}
            disabled={false}
            isDownloading={false}
            onDownloadPng={() => {}}
            onOpenHtmlDialog={onOpenHtmlDialog}
          />

          <div className={cn(`relative w-full h-auto shadow-sm rounded-[36px] overflow-hidden`, isSelected && toolMode !== TOOL_MODE_ENUM.HAND && "rounded-none")}>
            <iframe
              ref={iframeRef}
              srcDoc={fullHtml}
              title={title}
              sandbox="allow-scripts allow-same-origin"
              style={{
                width: "100%",
                minHeight: `${minHeight}px`,
                height: `${frameSize.height}px`,
                border: "none",
                pointerEvents: "none",
                display: "block",
                background: "white"
              }}
            />
          </div>
        </div>
      </Rnd>
    )
  }
  
  const Handle = () => (
    <div className="z-30 h-4 w-4 bg-white border-2 border-blue-500" />
  );


  export default DeviceFrame
  
