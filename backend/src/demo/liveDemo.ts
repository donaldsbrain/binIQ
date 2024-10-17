import { dimension, point } from 'hmi/src/shapePrimitives';
import { pipe, tap } from 'hmi/src/utility/pipe';
import { addCircularBin, addRectangularBin, BinLayout, binLayout } from '../domain/binLayout';
import { applyLayout, getLayout } from '../services/layoutUpdateService';
import { mapAsSome, valueOr } from 'hmi/src/utility/optional';
import { rgba } from 'hmi/src/graphicPrimitives';

export const liveDemo = () => pipe(
    binLayout({
        id: '55420215-355d-478d-abe0-7d5c61e81a4e', 
        dimensions: dimension(16, 9), 
        lineThickness: 0.5,
        background: rgba(0, 0, 0)
    }),
    addRectangularBin({
        center: point(6, 4.5), 
        dimensions: dimension(1, 1)}),
    addRectangularBin({
        center: point(8, 4.5), 
        dimensions: dimension(1, 1)}),
    addRectangularBin({
        center: point(10, 4.5), 
        dimensions: dimension(1, 1)}),
    addCircularBin({
        center: point(13, 4.5), 
        radius: 2}),
    addRectangularBin({
        center: point(4, 4.5), 
        dimensions: dimension(1, 1)}),
    tap(layout => {
        const isNew = pipe(
            getLayout(layout.id),
            mapAsSome(() => false),
            valueOr<boolean>(true)
        )            
        applyLayout(layout);
        if (isNew) {
            console.log(`layout (${layout.id}) created`);
            console.log(layout);
        }
    }),
    
)