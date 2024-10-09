import { dimension, point } from 'hmi/src/shapePrimitives';
import { pipe, tap } from 'hmi/src/utility/pipe';
import { addRectangularBin, BinLayout, binLayout } from '../domain/binLayout';
import { applyLayout, getLayout } from '../services/layoutUpdateService';
import { mapAsSome, valueOr } from 'hmi/src/utility/optional';

export const liveDemo = () => pipe(
    binLayout({id: '55420215-355d-478d-abe0-7d5c61e81a4e', dimensions: dimension(16, 9)}),
    addRectangularBin({
        center: point(8, 4.5), 
        dimensions: dimension(1, 1)}),
    addRectangularBin({
        center: point(10, 4.5), 
        dimensions: dimension(1, 1)}),
    addRectangularBin({
        center: point(12, 4.5), 
        dimensions: dimension(1, 1)}),
    addRectangularBin({
        center: point(12, 4.5), 
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
        }
    }),
    
)