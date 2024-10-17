import { Dimension, Point } from "hmi/src/shapePrimitives";
import { ColorStyle, GraphicPrimitive, rgba } from "hmi/src/graphicPrimitives";
import { v4 as uuidv4 } from 'uuid';

export type Bin = RectangularBin | CircularBin

type BinProperties = {
    center: Point
    fillRatio: number
}

export type BinLayout = {
    id: string
    background: ColorStyle
    dimensions: Dimension
    lineThickness: number
    bins: Bin[]
    graphics: GraphicPrimitive[]
}

export function binLayout(args: { 
    id?: string, 
    dimensions: Dimension, 
    lineThickness?: number, 
    background?: ColorStyle })
    : BinLayout {
    return {
        id: args.id ?? uuidv4(),
        background: args.background ?? rgba(0,0,0),
        dimensions: args.dimensions,
        lineThickness: args.lineThickness ?? 1,
        bins: [],
        graphics: []
    }
}

export type RectangularBin = {
    type: 'RectangularBin'
    dimensions: Dimension
} & BinProperties

type RectangularBinArgs = {
    center: Point
    dimensions: Dimension,
    fillRatio?: number
}

export function rectangularBin(args: RectangularBinArgs): RectangularBin {
    return {
        type: 'RectangularBin',
        center: args.center,
        dimensions: args.dimensions,
        fillRatio: args.fillRatio ?? 0
    }
}

export function addRectangularBin(args: RectangularBinArgs): (layout: BinLayout) => BinLayout {
    return layout => ({
        ...layout,
        bins: [
            ...layout.bins,
            rectangularBin(args)
        ]
    })    
}

export type CircularBin = {
    type: 'CircularBin'
    radius: number
} & BinProperties

export type CircularBinArgs = {
    center: Point
    radius: number
    fillRatio?: number
}

export function circularBin(args: CircularBinArgs): CircularBin {
    return {
        type: 'CircularBin',
        center: args.center,
        radius: args.radius,
        fillRatio: args.fillRatio ?? 0
    }
}

export function addCircularBin(args: CircularBinArgs): (layout: BinLayout) => BinLayout {
    return layout => ({
        ...layout,
        bins: [
            ...layout.bins,
            circularBin(args)
        ]
    })    
}