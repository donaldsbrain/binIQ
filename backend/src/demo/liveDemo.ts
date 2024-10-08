import { dimension } from 'hmi/shapePrimitives';
import { pipe, tap } from 'hmi/utility/pipe';
import { binLayout } from '../domain/binLayout';

export const demoLayout = () => pipe(
    binLayout({dimensions: dimension(16, 9)}),

    tap(({id}) => console.log(`Created new layout: ${id}`))
)