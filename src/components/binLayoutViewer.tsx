import { createRef, useEffect } from "react";
import { BinLayout } from "../../backend/src/domain/binLayout"
import { Observable } from 'rxjs';
import { matchSome, none, someNotNullish, Option, some } from "hmi/src/utility/optional";
import { toCartesian } from "hmi/src/drawers/htmlCanvas";
import { pipe } from "hmi/src/utility/pipe";
import { BinLayoutRepresentationState, drawRepresentation, updateRepresentation } from "../domain/binLayoutRepresentation";
import { now } from "../utility/time";

type BinLayoutViewerArgs = {
    source: Observable<BinLayout>
}

export function BinLayoutViewer(args: BinLayoutViewerArgs) {

    const canvasRef = createRef<HTMLCanvasElement>();
    
    useEffect(() => {
        let isRunning = true;
        let representation: Option<BinLayoutRepresentationState> = none();
        const contextMaybe = someNotNullish(canvasRef?.current?.getContext('2d'));
        args.source.subscribe(layout => {            
            representation = some(updateRepresentation(layout, representation));
            pipe(representation, matchSome(rep => {
                console.log(now(), rep);
            }))
        })
        function animate() {
            if (!isRunning) return;
            pipe(
                contextMaybe,
                matchSome(context => {
                    pipe(
                        representation,
                        matchSome(representation => toCartesian(context, 1, context => {                            
                            drawRepresentation(representation, context)
                        }))                        
                    )
                })
            )
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        return () => { isRunning = false };
    }, [args.source])

    return (
        <canvas id="bin-layout-viewer" ref={canvasRef} width="400" height="300" style={{'border': '1px dotted pink'}}></canvas>
    )
}