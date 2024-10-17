import { dimension, point } from 'hmi/src/shapePrimitives';
import { pipe, tap } from 'hmi/src/utility/pipe';
import { range } from 'hmi/src/utility/array';
import { addCircularBin, binLayout } from '../domain/binLayout';
import { applyLayout, getLayout } from '../services/layoutUpdateService';
import { mapAsSome, valueOr } from 'hmi/src/utility/optional';
import { rgba } from 'hmi/src/graphicPrimitives';

const binCount = 8;
const rows = 2;
const binWidth = 384;
const layoutWidth = 1920;
const layoutHeight = 1080;
const marginX = (layoutWidth - (Math.ceil(binCount / rows) - 1) * binWidth) / 2;
const marginY = (layoutHeight - ((rows - 1) * binWidth)) / 2;

export const liveDemo = () => pipe(
    binLayout({
        id: '55420215-355d-478d-abe0-7d5c61e81a4e', 
        dimensions: dimension(layoutWidth, layoutHeight), 
        lineThickness: 20,
        background: rgba(0, 0, 0)
    }),
    layout => pipe(
        range(binCount)
            .map(i => addCircularBin({
                center: point(marginX  + Math.floor(i/2) * binWidth, marginY + (i % 2) * binWidth),
                radius: binWidth / 2,
            }))
            .reduce((acc, action) => action(acc), layout)),
    tap(layout => {
        const isNew = pipe(
            getLayout(layout.id),
            mapAsSome(() => false),
            valueOr<boolean>(true)
        )            
        applyLayout(layout);
        if (isNew) {
            console.log(`layout (${layout.id}) created`);
        }
    }),
    
)