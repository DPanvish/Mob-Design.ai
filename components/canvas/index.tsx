import { useState } from 'react'
import { TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"
import { useCanvas } from '@/app/context/canvas-context';
import CanvasLoader from '../canvas-loader'
import { cn } from '@/lib/utils';
import CanvasFloatingToolbar from './canvas-floating-toolbar';
import { TOOL_MODE_ENUM, ToolModeType } from '@/lib/canvas';
import CanvasControls from './canvas-controls';
import DeviceFrame from './device-frame';
import DeviceFrameSkeleton from './device-frame-skeleton';
import HtmlDialog from './html-dialog';

const DEMO_HTML = `
  <style>
    .container {
      background-color: #e0f7fa;
      height: 100%;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    .content {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #00796b;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #555;
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .button {
      background-color: #00796b;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #004d40;
    }
  </style>
  <div class="container">
    <div class="content">
      <h1>Welcome!</h1>
      <p>This is a demo of the DeviceFrame component. You can customize the content and style as you like.</p>
      <button class="button">Get Started</button>
    </div>
  </div>
`;

const Canvas = ({isLoading}:{
  projectId: string;
  projectName: string | null;
  isLoading: boolean;
}) => {
  const {theme, frames, selectedFrame, loadingStatus} = useCanvas();
  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const [zoomPercent, setZoomPercent] = useState<number>(53);
  const [currentScale, setCurrentScale] = useState<number>(0.53);
  const [openHtmlDialog, setOpenHtmlDialog] = useState<boolean>(false);

  const currentStatus = isLoading
    ? "fetching"
  : loadingStatus !== "idle" && loadingStatus !== "completed"
  ? loadingStatus
  : null;

  const onOpenHtmlDialog = () => {
    setOpenHtmlDialog(true);
  };

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        <CanvasFloatingToolbar />

        {currentStatus && <CanvasLoader status={currentStatus} />}

        <TransformWrapper
          initialScale={0.53}
          initialPositionX={40}
          initialPositionY={5}
          minScale={0.1}
          maxScale={3}
          wheel={{step: 0.1}}
          pinch={{step: 0.1}}
          doubleClick={{disabled: true}}
          centerZoomedOut={false}
          centerOnInit={false}
          smooth={true}
          panning={{
            disabled: toolMode !== TOOL_MODE_ENUM.HAND,
          }}
          limitToBounds={false}
          onTransformed={(ref) => {
            setZoomPercent(Math.round(ref.state.scale * 100));
            setCurrentScale(ref.state.scale);
          }}
        >
          {({zoomIn, zoomOut}) => (
            <>
              <div 
                className={cn(`absolute inset-0 w-full h-full bg-[#eee] dark:bg-[#242423] p-3`, toolMode === TOOL_MODE_ENUM.HAND ? "cursor-grab active:cursor-grabbing" : "cursor-default")}
                style={{
                  backgroundImage: "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              >
                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    overflow: "unset",
                  }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                >

                  <div>
                    {frames?.map((frame, index: number) => {
                      const baseX = 100 + index * 480;
                      const y = 100;

                      if(frame.isLoading){
                        return (
                          <DeviceFrameSkeleton 
                            key={index}
                            style={{
                              transform: `translate(${baseX}px, 100px)`
                            }}
                          />
                        )
                      }

                      return (
                        <DeviceFrame
                          key={frame.id}
                          frameId={frame.id}
                          title={frame.title}
                          html={frame.htmlContent}
                          scale={currentScale}
                          initialPosition={{
                            x: baseX,
                            y
                          }}
                          toolMode={toolMode}
                          theme_style={theme?.style}
                          onOpenHtmlDialog={onOpenHtmlDialog}
                        />
                      )
                    })}
                  </div>

                  <DeviceFrame
                    frameId="DEMO"
                    title="DEMO"
                    html={DEMO_HTML}
                    scale={currentScale}
                    initialPosition={{
                      x: 1000,
                      y: 100
                    }}
                    toolMode={toolMode}
                    theme_style={theme?.style}
                    onOpenHtmlDialog={onOpenHtmlDialog}
                  />
                </TransformComponent>
              </div>

              <CanvasControls
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                zoomPercent={zoomPercent}
                toolMode={toolMode}
                setToolMode={setToolMode}
              />
            </>
          )}
        </TransformWrapper>
      </div>

      <HtmlDialog
        html={selectedFrame?.htmlContent || DEMO_HTML}
        title={selectedFrame?.title ?? "DEMO"}
        theme_style={theme?.style}
        open={openHtmlDialog}
        onOpenChange={setOpenHtmlDialog} 
      />
    </>
  )
}

export default Canvas
