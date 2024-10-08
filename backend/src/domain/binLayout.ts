import { Dimension, Point } from "hmi/shapePrimitives";
import { GraphicPrimitive } from "hmi/graphicPrimitives";
import { v4 as uuidv4 } from 'uuid'

export type Bin = RectangularBin | CircularBin

export type BinLayout = {
    id: string
    dimensions: Dimension
    lineThickness: number
    bins: Bin[]
    graphics: GraphicPrimitive[]
}

export function binLayout(args: { id?: string, dimensions: Dimension, lineThickness?: number }): BinLayout {
    return {
        id: args.id ?? uuidv4(),
        dimensions: args.dimensions,
        lineThickness: args.lineThickness ?? 1,
        bins: [],
        graphics: []
    }
}

export type RectangularBin = {
    type: 'RectangularBin'
    center: Point
    dimensions: Dimension
}

export type CircularBin = {
    type: 'CircularBin'
    center: Point
    radius: number
}