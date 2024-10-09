import { createRef, useEffect } from "react";
import { BinLayout } from "../../backend/src/domain/binLayout"
import { Observable } from 'rxjs';
import { matchSome, someNotNullish } from "hmi/src/utility/optional";
import { draw, toCartesian } from "hmi/src/drawers/htmlCanvas";
import { font, rbga, textGraphic } from "hmi/src/graphicPrimitives";
import { point } from "hmi/src/shapePrimitives";
import { pipe } from "hmi/src/utility/pipe";

type BinLayoutViewerArgs = {
    source: Observable<BinLayout>
}

export function BinLayoutViewer(args: BinLayoutViewerArgs) {

    const canvasRef = createRef<HTMLCanvasElement>();
    
    useEffect(() => {
        const contextMaybe = someNotNullish(canvasRef?.current?.getContext('2d'));
        args.source.subscribe(layout => {
            console.log('ID!!!!', layout.id, contextMaybe);
            const text = textGraphic({
                text: layout.bins.length.toString(),
                baselineStartPosition: point(200, 150),
                horizontalAlignment: 'center',
                color: rbga(255, 0, 0),
                font: font({
                    size: 60
                }),
                outline: {
                    thickness: 0.5,
                    color: rbga(0, 255, 255)
                }
            
            })
            pipe(
                contextMaybe,
                matchSome(context => {
                    
                    toCartesian(context, 1, context => {
                        draw(text, context)
                    })
                })
            )
        })
    }, [args.source])

    return (
        <canvas id="bin-layout-viewer" ref={canvasRef} width="400" height="300" style={{'border': '1px dotted pink'}}></canvas>
    )
}