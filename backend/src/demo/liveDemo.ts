import { dimension, point } from 'hmi/src/shapePrimitives';
import { pipe, tap } from 'hmi/src/utility/pipe';
import { addRectangularBin, BinLayout, binLayout } from '../domain/binLayout';
import { applyLayout } from '../services/layoutUpdateService';

export const demoLayout = () => pipe(
    binLayout({id: '55420215-355d-478d-abe0-7d5c61e81a4e', dimensions: dimension(16, 9)}),
    addRectangularBin({
        center: point(8, 4.5), 
        dimensions: dimension(1, 1)}),
    addRectangularBin({
        center: point(10, 4.5), 
        dimensions: dimension(1, 1)}),    
    tap(applyLayout),
    tap(({id}) => console.log(`Created new layout: ${id}`))
    
)