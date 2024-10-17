import { createRef, useEffect, useState } from "react";
import { BinLayout } from "../../backend/src/domain/binLayout"
import { Observable } from 'rxjs';
import { matchSome, none, someNotNullish, Option, some } from "hmi/src/utility/optional";
import { toCartesian } from "hmi/src/drawers/htmlCanvas";
import { pipe, tap } from "hmi/src/utility/pipe";
import { BinLayoutRepresentationState, drawRepresentation, updateRepresentation } from "../domain/binLayoutRepresentation";

type BinLayoutViewerArgs = {
    source: Observable<BinLayout>
}

export function BinLayoutViewer(args: BinLayoutViewerArgs) {

    const canvasRef = createRef<HTMLCanvasElement>();
    const width = 400;
    const [height, setHidth] = useState(300);
    
    useEffect(() => {
        let isRunning = true;
        let representation: Option<BinLayoutRepresentationState> = none();
        const contextMaybe = someNotNullish(canvasRef?.current?.getContext('2d'));
        args.source.subscribe(layout => {            
            representation = some(updateRepresentation(layout, representation));
            // pipe(representation, matchSome(rep => {
            //     console.log(now(), rep);
            // }))
        })
        function animate() {
            if (!isRunning) return;
            pipe(
                contextMaybe,
                matchSome(context => {
                    pipe(
                        representation,
                        matchSome(representation => pipe(
                            width / representation.dimensions.width,
                            tap(ratio => setHidth(representation.dimensions.height * ratio)),
                            ratio => toCartesian(context, ratio, context => {                            
                                drawRepresentation(representation, context)
                            })))
                    )
                })
            )
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        return () => { isRunning = false };
    }, [args.source])

    return (
        <canvas id="bin-layout-viewer" ref={canvasRef} width={width} height={height} style={{'border': '1px dotted pink', width, height}}></canvas>
    )
}